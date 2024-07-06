# import fitz  # PyMuPDF
# import os
# print(os.getcwd())

# doc = fitz.open("./pdf2png/1610.pdf")
# for page_number in range(len(doc)):
#     page = doc.load_page(page_number)
#     pix = page.get_pixmap()
#     output = f"./pdf2png/output_page_{page_number}.png"
#     pix.save(output)

from pathlib import Path
import fitz  # Import PyMuPDF

def convert_pdf_to_images(pdf_directory, dpi=300):
    pdf_directory = Path(pdf_directory)
    zoom_x = dpi / 72  # 72 is the default DPI in PDFs
    zoom_y = dpi / 72
    mat = fitz.Matrix(zoom_x, zoom_y)  # Create a transformation matrix for the desired DPI

    for pdf_path in pdf_directory.glob('*.pdf'):
        doc = fitz.open(pdf_path)
        for page_number in range(len(doc)):
            page = doc.load_page(page_number)
            pix = page.get_pixmap(matrix=mat)
            output_path = pdf_directory / f"output_page_{page_number}_{pdf_path.stem}.png"
            pix.save(output_path)

# Specify the directory containing PDFs
convert_pdf_to_images("./pdf2png", dpi=500) # dpi越高图越清晰

