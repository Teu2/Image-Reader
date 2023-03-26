import React, { useState, useEffect } from 'react';

// Icons
import { toast } from 'react-toastify';
import { AiOutlineInfoCircle } from "react-icons/ai";
import { FiRefreshCw } from "react-icons/fi";

// Mantine UI
import { Popover, Text, Tooltip, Button, Loader } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

// SCSS
import './UploadSection.scss';
import 'react-toastify/dist/ReactToastify.css';

// Components
import { Dropdowns } from '../dropdowns/Dropdowns';
import { DragDropZone } from '../dropzone/DragDropZone';
import { TranslateButton } from '../translate button/TranslateButton';

export const UploadSection = () => {

    // image hook useStates to display and translate
    const [images, setImages] = useState([]); // manga panels 
    const [mergedPanels, setMergedPanels] = useState([]); 

    // useState hooks needed for translation
    const [language, setLanguage] = useState(""); 
    const [kanjiDirection, setKanjiDirection] = useState("");
    const [translatedText, setTranslatedText] = useState(""); 

    const [opened, { close, open }] = useDisclosure(false);
    
    // hook used to determine whether or not using has created a box highlight
    const [dragSelecter, setDragSelector] = useState("");
    const [dragSelecterImg, setdragSelecterImg] = useState("");

    // hook used to give user indication that the application is translating and not freezing
    const [isTranslating, setIsTranslating] = useState(false); 

    const handleLanguageChange = (value) => {
        setLanguage(value);
    };

    const handleKanjiDirChange = (value) => {
        setKanjiDirection(value);
    }

    const removePanel = () => { // removes upladed panels on the screen by the user
        setMergedPanels([]);
        setImages([]);
        setTranslatedText("");
    }

    useEffect(() => {
        console.log(`language: ${language}`); // debugging
        console.log(`kanji dir: ${kanjiDirection}`); // debugging
        console.log(`translated Text: ${translatedText}`); // debugging
    }, [language, kanjiDirection, mergedPanels, images, translatedText]); // useEffect runs everytime values in the passed array is changed - if you want to run it once, replace with empty array instead

    const invalidNotify = (e) => toast.error(e, {
        position: "bottom-center", autoClose: 5000,
        hideProgressBar: true, closeOnClick: true,
        pauseOnHover: false, draggable: true,
        progress: undefined, theme: "colored",
    });

    return (
        <div className="upload-section">
            <div className="selection-info">

                {/* drop down selection to choose language and letter character direction */}
                <div className="drop-down-selection">
                    <Dropdowns  language={language} handleLanguageChange={handleLanguageChange} kanjiDirection={kanjiDirection} handleKanjiDirChange={handleKanjiDirChange}/>
                </div>

                {/* popover to help user use the application */}
                <div className="info-cta">
                    <Popover width={200} position="bottom" withArrow shadow="md" opened={opened}>
                        <Popover.Target>
                            <Button onMouseEnter={open} onMouseLeave={close}><AiOutlineInfoCircle/></Button>
                        </Popover.Target>
                        <Popover.Dropdown sx={{ pointerEvents: 'none' }}>
                            <Text size="xs">
                                <ol>
                                    <li><p><span className="ot">1.</span> Select a language you want to translate to using the dropdown box on the left.</p></li>
                                    <li><p><span className="ot">2.</span> Now select the letter direction, this is important! otherwise you'll get a wrong translation 😢</p></li>
                                    <li><p><span className="ot">3.</span> Click 'TRANSLATE', and you're done! just read the translated text below your uploaded image!</p></li>
                                    <li><p><span className="ot">Note:</span> uploading 2 images will make the merge! (later feature)</p></li>
                                </ol>
                            </Text>
                        </Popover.Dropdown>
                    </Popover>
                </div>
            </div>

            {/*UPLOAD ZONE - this is where the user will either upload or drag and drop their images into the component (UI output depends on image size) */}
            <DragDropZone images={images} setImages={setImages} invalidNotify={invalidNotify} mergedPanels={mergedPanels}/>
            
            <div className="center">
                {isTranslating ? (<><Loader/> <p id="translating-text"> Translating...</p></>) : (<>{translatedText === "" ? (<p>Translated text: <em>nothing yet...</em> </p>) : (<p>Translated text: "{translatedText}"</p>)}</>)}
            </div>

            {/* TRANSLATE SECTION - button and logic that goes into translating the image uploaded in the 'UPLOAD ZONE' is here */}
            <div className="center flex-end"> 
                {/* position relative for flex-end - then position absolute for the button and svg, button center 0 and svg right 0 - do later */}
                <TranslateButton images={images} language={language} invalidNotify={invalidNotify} kanjiDirection={kanjiDirection} setMergedPanels={setMergedPanels} mergedPanels={mergedPanels} setTranslatedText={setTranslatedText} setIsTranslating={setIsTranslating}/>
                <Tooltip label="Refresh image upload" color="dark" position="bottom" withArrow>
                    <Button><FiRefreshCw onClick={removePanel}/></Button>              
                </Tooltip>
            </div>
        </div>
    )
}
