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
    
            // console.log("values of", values);
    
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
    
            const saveFiles = async (fileData) => {
                return new Promise((resolve, reject) => {
                    if (fileData) {
                        fs.writeFile(`${uploadDir}/${fileData}`, fileData, {flag: 'w'},(err) => {
                            if (err) {
                                console.log("Error saving file:", err);
                                reject(err);
                            } else {
                                resolve();
                            }
                        });
                    } else {
                        console.log("File data or filename missing");
                        reject("File data or filename missing");
                    }
                });
            };
            await Promise.all([
                saveFiles(IDProof), 
                saveFiles(StoreDocument),
                saveFiles(StorePhoto) 
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
            
            console.log("Fetched all vendors successfully");
            return res.status(200).json({ vendors: rows }); // Sending fetched vendors as response
        });
    },
    getsingleVendor:(req,res)=>{
        const getSingleVendorData = req.body;
        const id = getSingleVendorData.id;
    
        // Construct the query to fetch a single vendor based on folderid
        const selectQuery = `
            SELECT *
            FROM vendor
            WHERE id = ?
        `;
    
        connection.query(selectQuery, [id], (err, rows) => {
            if (err) {
                console.error("Error fetching single vendor:", err);
                return res.status(500).json({ error: "Failed to fetch vendor" });
            }
    
            if (rows.length === 0) {
                // If no vendor found with the given folderid
                return res.status(404).json({ message: "Vendor not found" });
            }
    
            // Vendor information found
            console.log("Fetched single vendor successfully");
            return res.status(200).json({ vendor: rows[0] });
        });

    },
    editVendor: (req, res) => {
        const editvendorData = req.body;
        const id = editvendorData.id;
    
        // Extract the fields to be updated from vendorData
        const {
            VendorName,
            StoreName,
            Address,
            EmailID,
            PhoneNumber,
            IDProof,
            StoreDocument,
            StorePhoto,
            LoginID,
            Password,
            roles,
            vstatus,
            vcomment
        } = vendorData;
    
        // Construct the update query based on the provided fields
        const editQuery = `
            UPDATE vendor
            SET 
                VendorName = ?,
                StoreName = ?,
                Address = ?,
                EmailID = ?,
                PhoneNumber = ?,
                IDProof = ?,
                StoreDocument = ?,
                StorePhoto = ?,
                LoginID = ?,
                Password = ?,
                roles = ?,
                vstatus = ?,
                vcomment = ?
            WHERE id = ?
        `;
    
        const values = [
            VendorName,
            StoreName,
            Address,
            EmailID,
            PhoneNumber,
            IDProof,
            StoreDocument,
            StorePhoto,
            LoginID,
            Password,
            roles,
            vstatus,
            vcomment,
            id
        ];
    
        // Now you can execute the query using your database connection
        connection.query(editQuery, values, (err, result) => {
            if (err) {
                console.error("Error updating vendor:", err);
                return res.status(500).json({ error: "Failed to update vendor" });
            }
    
            console.log("Vendor updated successfully");
            return res.status(200).json({ message: "Vendor updated successfully" });
        });
    },
    deleteVendor:(req,res)=>{
        const deleteVendorData = req.body;
        const id = deleteVendorData.id;
    
        // Construct the query to fetch a delete vendor based on folderid
        const deleteQuery = `
        DELETE FROM vendor
        WHERE id = ?
    `;

    
        connection.query(deleteQuery, [id], (err, rows) => {
            if (err) {
                console.error("Error fetching single vendor:", err);
                return res.status(500).json({ error: "Failed to fetch vendor" });
            }
    
            if (rows.length === 0) {
                // If no vendor found with the given folderid
                return res.status(404).json({ message: "Vendor not found" });
            }
    
            // Vendor information found
            console.log(" Vendor deleted successfully");
            return res.status(200).json({ vendor: rows[0] });
        });

    },
};

module.exports = VendorService;
