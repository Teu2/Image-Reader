import React from "react";
import { GrUpload } from "react-icons/gr";

export const DragDropZone = ({images, setImages, invalidNotify, mergedPanels}) => {

    const handleDrop = (event) => { // handles image upload
        event.preventDefault(); 
        const newImages = [...images];

        if(images.length === 2) return; // limits to 2 only - avoids performance issues since this is a small app and I have no money for servers
        if(event.dataTransfer.files.length > 2){
            invalidNotify("Please only upload 2 pages!");
            return;
        }

        for(let i = 0; i < event.dataTransfer.files.length && i < 2; i++){
            const file = event.dataTransfer.files[i];

            if(file.type.includes("image/")){
                newImages.push(URL.createObjectURL(file));
            }else{
                invalidNotify("Please only upload image files!");
                return;
            }
        }

        setImages(newImages)
        console.log("image added!");
    };

    const handleFileInputChange = (event) => {
        if(images.length === 2) return;
        const newImages = [...images];

        for (let i = 0; i < event.target.files.length && i < 2; i++){
            const file = event.target.files[i];
            
            if (file.type.includes('image/')) { // Check if file is an image
              newImages.push(URL.createObjectURL(file));
            }else{
                invalidNotify("Please only upload image files!");
                return;
            }
        }
      
        setImages(newImages);
        console.log("image added!");
    };

    return(
        <div>
            {images.length > 0 ? (
                <React.Fragment> {/* display after user uploads images - changes between merged or single */}
                    <div className="file-upload-section-1" onDrop={handleDrop} onDragOver={(event) => event.preventDefault()} onClick={() => document.getElementById('fileInput').click()}>
                        <input type="file" id="fileInput" style={{ display: 'none' }} onChange={handleFileInputChange} multiple accept=".png"/>
                            {mergedPanels.length > 0 ? (
                                    <React.Fragment>
                                        {/* dont need to map over mergedPanels array since it will only contains 1 image */}
                                        <img src={mergedPanels} alt="merged panels"></img> 
                                    </React.Fragment>
                                ) : (
                                    <React.Fragment>
                                        {images.map((panel) => (
                                            <img key={panel} src={panel} alt="upladed panel"></img>
                                        ))}
                                    </React.Fragment>    
                                )
                            }
                    </div>
                </React.Fragment>
            ) : (
                <React.Fragment> {/* default display if no image is uploaded*/}
                    <div className="file-upload-section-1" onDrop={handleDrop} onDragOver={(event) => event.preventDefault()} onClick={() => document.getElementById('fileInput').click()}>
                        <span>
                            <GrUpload className="upload-svg"/>
                            <p>Upload or drag and drop images here</p> 
                        </span>
                        <input type="file" id="fileInput" style={{ display: 'none' }} onChange={handleFileInputChange} multiple accept=".png"/>
                            {images.map((panel) => (
                                <img key={panel} src={panel} alt="panel"></img>
                            ))}
                    </div>
                </React.Fragment>
            )}
        </div>
    );
}