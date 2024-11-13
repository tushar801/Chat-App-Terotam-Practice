import puppeteer from 'puppeteer';
import * as XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';
import { Request, Response } from 'express';
import { UserRepository } from '../repositories/UserRepository';
import Handlebars from 'handlebars';

// HTML template path
const templatePath = path.join(__dirname, '../templates/userDownload.html');

// Function to generate PDF
const generatePDF = async (title: string, headers: string[], data: any[]): Promise<Buffer> => {
    const html = fs.readFileSync(templatePath, 'utf-8');
    const template = Handlebars.compile(html);

    
    const finalHtml = template({ title, headers, data });
    

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(finalHtml, { waitUntil: 'domcontentloaded' });

    const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
    });
    
    const blob = Buffer.from(new Uint8Array(pdfBuffer))
    await browser.close();
    return blob;
};

// Function to generate Excel
const generateExcel = (headers: string[], data: any[]): Buffer => {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data, { header: headers });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'User Data');
    return XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
};

// Exported controller function
export const handleFileGeneration = async (req: Request, res: Response) => {
    const { type }: { type: number } = req.body;

    try {
        // Fetch active users from the repository
        const data: any[] = await UserRepository.fetchActiveUsers(); 
        console.log('Data fetched from the repository:', data); //debugging line

        if (data.length === 0) {
            console.log('No active users found.');
            return res.status(404).send('No active users found.');
        }

        const headers = Object.keys(data[0]); // Get headers dynamically from the first object
        const title = "Active Users Data"; // Dynamic title

        if (type === 1) {
            const pdfBuffer = await generatePDF(title, headers, data);
            res.set({
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename="data.pdf"',
                'Content-Length': pdfBuffer.length,
            });
            res.send(pdfBuffer);
        } else if (type === 2) {
            const excelBuffer = generateExcel(headers, data);
            res.set({
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Content-Disposition': 'attachment; filename="data.xlsx"',
                'Content-Length': excelBuffer.length,
            });
            res.send(excelBuffer);
        } else {
            res.status(400).send('Invalid type. Use 1 for PDF or 2 for Excel.');
        }
    } catch (error) {
        res.status(500).send('Error generating file: ' + (error instanceof Error ? error.message : 'An unknown error occurred.'));
    }
};
