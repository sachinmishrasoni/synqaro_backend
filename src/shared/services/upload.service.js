import cloudinary from "#config/cloudinary.js";

// export const uploadToCloudinary = (fileBuffer, folder) => {
//     return new Promise((resolve, reject) => {
//         cloudinary.uploader.upload_stream(
//             { folder },
//             (error, result) => {
//                 if (error) return reject(error);
//                 resolve(result);
//             }
//         ).end(fileBuffer);
//     });
// };

export const uploadImage = (fileBuffer, folder = "general") => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            {
                folder,
                resource_type: "image"
            },
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }
        ).end(fileBuffer);
    });
};

export const deleteImage = async (publicId) => {
    if (!publicId) return;

    await cloudinary.uploader.destroy(publicId);
};
