const connection = require('../database/dbconn');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const VendorService = {
    createVendor: (req, res) => {
        const vendorData = req.body;
        const roles = 'Vendor'
        const uniqueFolderName = uuidv4(); // Generate a unique folder name using UUID
        const uploadDir = path.join(__dirname, `../uploads/${uniqueFolderName}/`);
        const { IDProof, StoreDocument, StorePhoto, ...otherData } = vendorData;

        const insertQuery = `
            INSERT INTO vendor (VendorName, StoreName, Address, EmailID, PhoneNumber, IDProof, StoreDocument, StorePhoto, LoginID, Password,roles,vstatus,vcomment,folderid)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?,?)
        `;

        const values = [
            vendorData.VendorName,
            vendorData.StoreName,
            vendorData.Address,
            vendorData.EmailID,
            vendorData.PhoneNumber,
            vendorData.IDProof,
            vendorData.StoreDocument,
            vendorData.StorePhoto,
            vendorData.LoginID,
            vendorData.Password,
            roles,
            vendorData.status,
            vendorData.comment,
            uniqueFolderName
            
        ];
        connection.query(insertQuery, values, (err, result) => {
            if (err) {
                console.error("Error inserting vendor:", err);
                return res.status(500).json({ error: "Failed to create vendor" });
            }

            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            const saveFiles = (file, fileName) => {
                file.mv(`${uploadDir}/${fileName}`, (err) => {
                    if (err) {
                        console.log("Error saving file:", err);
                    }
                });
            };

            saveFiles(IDProof, IDProof.name);
            saveFiles(StoreDocument, StoreDocument.name);
            saveFiles(StorePhoto, StorePhoto.name);

            console.log("Vendor created successfully");
            return res.status(200).json({ message: "Vendor created successfully", vendorId: result.insertId });
        });
    },
    getAllVendor: (req, res) => {
        const selectQuery = `
            SELECT * FROM vendor
        `;

        connection.query(selectQuery, (err, rows) => {
            if (err) {
                console.error("Error fetching vendors:", err);
                return res.status(500).json({ error: "Failed to fetch vendors" });
            }

            const vendorsWithFiles = rows.map((vendor) => {
                const uploadDir = path.join(__dirname, `../uploads/${vendor.folderid}/`);

                const vendorFiles = {
                    IDProof: path.join(uploadDir, vendor.IDProof),
                    StoreDocument: path.join(uploadDir, vendor.StoreDocument),
                    StorePhoto: path.join(uploadDir, vendor.StorePhoto)
                };

                return {
                    ...vendor,
                    ...vendorFiles
                };
            });

            console.log("Fetched all vendors successfully");
            return res.status(200).json({ vendors: vendorsWithFiles });
        });
    }
};

module.exports = VendorService;
