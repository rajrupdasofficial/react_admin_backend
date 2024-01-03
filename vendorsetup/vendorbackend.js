const connection = require('../database/dbconn');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const VendorService = {
    createVendor: async (req, res) => {
        try {
            const vendorData = req.body;
            const roles = 'Vendor';
            const uniqueFolderName = uuidv4();
            const uploadDir = path.join(__dirname, `../uploads/${uniqueFolderName}/`);
    
            const { IDProof, StoreDocument, StorePhoto, ...otherData } = vendorData;
    
            const insertQuery = `
                INSERT INTO vendor (VendorName, StoreName, Address, EmailID, PhoneNumber, IDProof, StoreDocument, StorePhoto, LoginID, Password, roles, vstatus, vcomment, folderid)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;
    
            const values = [
                otherData.VendorName,
                otherData.StoreName,
                otherData.Address,
                otherData.EmailID,
                otherData.PhoneNumber,
                IDProof,
                StoreDocument,
                StorePhoto,
                otherData.LoginID,
                otherData.Password,
                roles,
                otherData.vstatus,
                otherData.vcomment,
                uniqueFolderName
            ];
    
            console.log("values of", values);
    
            const result = await new Promise((resolve, reject) => {
                connection.query(insertQuery, values, (err, result) => {
                    if (err) {
                        console.error("Error inserting vendor:", err);
                        reject(err);
                    } else {
                        resolve(result);
                    }
                });
            });
    
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }
    
            const saveFiles = async (file, fileName) => {
                return new Promise((resolve, reject) => {
                    if (file) {
                        file.mv(`${uploadDir}/${fileName}`, (err) => {
                            if (err) {
                                console.log("Error saving file:", err);
                                reject(err);
                            } else {
                                resolve();
                            }
                        });
                    } else {
                        console.log("File or filename missing");
                        reject("File or filename missing");
                    }
                });
            };
    
            await Promise.all([
                saveFiles(IDProof, IDProof.fileName), 
                saveFiles(StoreDocument, StoreDocument.fileName),
                saveFiles(StorePhoto, StorePhoto.fileName) 
            ]);
    
            console.log("Vendor created successfully");
            return res.status(200).json({ message: "Vendor created successfully"});
    
        } catch (error) {
            console.error("Error creating vendor:", error);
            return res.status(500).json({ error: "Failed to create vendor" });
        }
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
