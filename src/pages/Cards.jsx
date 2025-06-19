import React, { useRef, useState } from 'react';
import { createWorker } from 'tesseract.js';
import Webcam from 'react-webcam';

const Cards = () => {
  const webcamRef = useRef(null);
  const imageRef = useRef(null);
  const [text, setText] = useState('');

  const videoConstraints = {
    facingMode: 'environment',
  };

  const preprocessImage = () => {
    const video = webcamRef.current.video;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert to grayscale + thresholding
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i+1] + data[i+2]) / 3;
        data[i] = avg;
        data[i+1] = avg;
        data[i+2] = avg;
      }
    ctx.putImageData(imageData, 0, 0);

    return canvas.toDataURL(); // Pass this to Tesseract
  };

  const capture = async () => {
    if (webcamRef.current) {
        const imageSrc = preprocessImage();

        imageRef.current.src = imageSrc;
        try {
        const worker = await createWorker('eng');
        await worker.setParameters({
            tessedit_pageseg_mode: 3,
        });

        const { data } = await worker.recognize(imageSrc);

        const lines = data?.lines || data?.text?.split('\n').map((t) => ({ text: t, confidence: 100 })) || [];

        console.log(lines);

        const cleanedLines = lines
        .filter((line) => line.confidence > 70 && line.text.length > 2 && line.text.length < 40)
        .map((line) => line.text.trim())
        .filter((line) =>
            /^[A-Z][a-zA-Z'’ -]+$/.test(line) // Starts with capital, basic Latin chars, hyphen/apostrophes allowed
        );

        await worker.terminate();

            setText(cleanedLines.join('\n') || 'No valid text found.');
            //setText(data.text);
        } catch (error) {
            console.error('Error during OCR:', error);
            setText('OCR failed. Try again.');
        }
    }
    };


  return (
    <div className="w-full h-[95dvh] flex flex-col justify-start items-center p-4 pb-6">
      <Webcam
        className="w-full h-1/3 object-cover aspect-[9/16] rounded-lg"
        audio={false}
        ref={webcamRef}
        videoConstraints={videoConstraints}
        screenshotFormat="image/png"
      />
      <img className="h-1/3" alt="Preprocessed Image"  ref={imageRef}/>
      <div className="w-full h-1/4 flex flex-row justify-between items-center gap-2">
        <textarea
          className="w-full h-full text-xl font-mono border-2 border-primary px-4 py-2 resize-none"
          readOnly
          value={text}
        />
        <button
          className="mt-4 text-xl font-bold btn btn-xl btn-primary px-4 py-2 rounded-md cursor-pointer"
          onClick={capture}
        >
          Scan
        </button>
      </div>
    </div>
  );
};

export default Cards;
