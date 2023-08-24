import React, { useState } from 'react';
import './App.css';
import { PDFDocument, rgb } from 'pdf-lib';

function App() {
  const [pdfFiles, setPdfFiles] = useState([]);
  const [mergedPdf, setMergedPdf] = useState(null);

  const handleFileChange = (event) => {
    const newFiles = Array.from(event.target.files);
    setPdfFiles(newFiles);
  };

  const mergePDFs = async () => {
    try {
      const mergedPdfDoc = await PDFDocument.create();
      for (const pdfFile of pdfFiles) {
        const pdfBytes = await pdfFile.arrayBuffer();
        const pdfDoc = await PDFDocument.load(pdfBytes);

        const pages = await mergedPdfDoc.copyPages(pdfDoc, pdfDoc.getPageIndices());
        pages.forEach((page) => {
          mergedPdfDoc.addPage(page);
        });
      }

      const mergedPdfBytes = await mergedPdfDoc.save();
      setMergedPdf(new Blob([mergedPdfBytes], { type: 'application/pdf' }));
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  return (
    <div className="App">
      <h1>PDF Merger</h1>
      <input type="file" multiple onChange={handleFileChange} />
      <button onClick={mergePDFs}>Merge PDFs</button>

      {mergedPdf && (
        <div>
          <h2>Merged PDF</h2>
          <iframe
            title="Merged PDF Viewer"
            src={URL.createObjectURL(mergedPdf)}
            width="600"
            height="400"
          />
          <a href={URL.createObjectURL(mergedPdf)} download="merged.pdf">
            Download Merged PDF
          </a>
        </div>
      )}
    </div>
  );
}

export default App;
