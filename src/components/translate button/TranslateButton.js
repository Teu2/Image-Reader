import React from 'react'
import Tesseract from 'tesseract.js';
import axios from 'axios';

export const TranslateButton = ({ images, language, invalidNotify, kanjiDirection, setMergedPanels, setTextArray, setTranslatedText }) => {
    const rapidApiKey = process.env.REACT_APP_RAPIDAPI_KEY;

    const translatePanels = async () => { // translates panels
        // initial checking
        if(language === ""){ invalidNotify("Please choose a language!"); return; }
        if(kanjiDirection === ""){ invalidNotify("Please choose a letter direction!"); return; }
        if(images.length === 0){ invalidNotify("Please upload images before translating!"); return; }

        if(images.length === 1){ // translate instantly
            detectText(images[0]);
        }else{ 
            // merge panels first, after merging then proceed to detect text, otherwise user needs to click translate button again
            mergePanels().then((mergedPanelsURL) => {
                detectText(mergedPanelsURL).then((newTextArray) => {
                    setTextArray(newTextArray);
                })
            });
        }
    }

    const formatVertText = (text) => { // formats vertical text into horizontal to be translated more accurately
        const lines = text.trim().split('\n');
        let formattedLines = [];
        
        for (let i = 0; i < lines.length; i++) {
          const characters = lines[i].split(' ');
          for (let j = 0; j < characters.length; j++) {
            if (i === 0) {
              formattedLines[j] = characters[j];
            } else {
              formattedLines[j] += characters[j];
            }
          }
        }
        return formattedLines.join(' ');
    }

    const translateText = (finalOutput) => {
        let delimittedString = finalOutput.replace(/[&\/\\#,+()$~%.'":*?<>{}①⑤④]/g, '');

        console.log(`delimittedString: ${delimittedString}`)
        const options = {
            method: 'POST',
            url: 'https://translate-plus.p.rapidapi.com/translate',
            headers: {
                'content-type': 'application/json',
                'X-RapidAPI-Key': rapidApiKey,
                'X-RapidAPI-Host': 'translate-plus.p.rapidapi.com'
            },
            data: `{"text": "${delimittedString}","source":"ja","target":"${language}"}`
        };
          
        axios.request(options).then(function (response) {
            console.log(`translated text: ${response.data.translations.translation}`);
            setTranslatedText(response.data.translations.translation);
        }).catch(function (error) {
            console.error(error);
        });
    }

    const detectText = async (imageURL) => { // detect text
        console.log("translating...");
        let regex1 = /[^\u3000-\u30FF\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/g; // regex 1 - horizontal
        let regex2 = /[^\u0020\u00A0\u3000-\u30FF\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/g; // regex 2 - vertical
        
        // detect japanese characters using Tesseract OCR 
        await Tesseract.recognize(
            imageURL,
            'jpn', // jpn_vert is horrible I don't know why they have it as an option, use jpn instead
        { logger: m => console.log(`1. ${m}`) }
        ).then(({ data: { text } }) => {

            if(kanjiDirection === "hor"){
                var horOutput = text.replace(regex1, "");
                translateText(horOutput);
            }else{
                const formattedText = formatVertText(text).split("").reverse().join(""); // format the text vertically
                const arr = formattedText.split(" ");
                console.log(text);
                
                for(let i = 0; i < arr.length; i++){
                    arr[i] = reverseString(arr[i]);
                    console.log(arr[i]);
                }

                var vertOutput = arr.toString().replaceAll(",", " ");
                vertOutput = vertOutput.replace(regex2, "");
                console.log(`final output (RAW): ${vertOutput}`);
                translateText(vertOutput);
            }
            
        });
    }

    const reverseString = (string) => { // reversing string without needing to do chaining
        let newString = "";
        for(let i = string.length -1; i>= 0; i--){
            newString += string[i];
        }
        return newString;
    }

    const dataURItoBlob = (dataURI) => { // convert base64/URLEncoded data component to raw binary data held in a string
        var byteString;

        if (dataURI.split(',')[0].indexOf('base64') >= 0) {
            byteString = atob(dataURI.split(',')[1]);
        } else {
            byteString = unescape(dataURI.split(',')[1]);
        }

        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0] // separate out the mime component

        var ia = new Uint8Array(byteString.length); // write the bytes of the string to a typed array
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }

        return new Blob([ia], { type: mimeString });
    }

    const mergePanels = () => {
        return new Promise((resolve) => {
            const file1 = images[0];
            const file2 = images[1];
    
            // Create canvas element
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
    
            // Load images
            const image1 = new Image();
            const image2 = new Image();
    
            image1.onload = () => {
                image2.onload = () => {
                    // Draw images on canvas
                    canvas.width = image1.width + image2.width;
                    canvas.height = Math.max(image1.height, image2.height);
                    context.drawImage(image1, 0, 0, image1.width, image1.height);
                    context.drawImage(image2, image1.width, 0, image2.width, image2.height);
    
                    // Export canvas as image
                    const mergedImage = canvas.toDataURL('image/png');
                    console.log(`1. mergedImage ${mergedImage}`);
                    setMergedPanels(mergedImage); // image to display
    
                    // convert data URL to blob
                    const blob = dataURItoBlob(mergedImage);
    
                    // get URL of blob to use for translation
                    const url = URL.createObjectURL(blob);
                    console.log(`3. url ${url}`);
                    resolve(url);
    
                };
                image2.src = file2;
            };
            image1.src = file1;
            console.log("merged!");
        });
    };

    return (
        // Translate button
        <div className="center flex-end">
            <button className="translate-button" onClick={translatePanels}>TRANSLATE</button>
        </div>
    );
}
