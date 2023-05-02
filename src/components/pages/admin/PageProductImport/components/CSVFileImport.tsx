import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import axios from "axios";

type CSVFileImportProps = {
  url: string;
  title: string;
};

export default function CSVFileImport({ url, title }: CSVFileImportProps) {
  const [file, setFile] = useState<File>();

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setFile(file);
    }
  };

  const removeFile = () => {
    setFile(undefined);
  };

  const uploadFile = async () => {
    console.log("uploadFile to", url);
    const authTokenKey = "authorization_token";

    if (!file) return;
    // Get the presigned URL
    try {
      const token = localStorage.getItem(authTokenKey);
      console.log("In uploadFile token: ", token);
      const response = await axios({
        method: "GET",
        url,
        headers: token ? { Authorization: `Basic ${token}` } : undefined,
        params: {
          name: encodeURIComponent(file.name),
        },
      });
      console.log("File to upload: ", file.name);
      console.log("Uploading to: ", response.data?.payload);
      const result = await fetch(response.data.payload, {
        method: "PUT",
        body: file,
      });
      console.log("Result: ", result);
    } catch (err) {
      localStorage.removeItem(authTokenKey);
      console.error("Error: ", err);
    } finally {
      setFile(undefined);
    }
  };
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      {!file ? (
        <input type="file" onChange={onFileChange} />
      ) : (
        <div>
          <button onClick={removeFile}>Remove file</button>
          <button onClick={uploadFile}>Upload file</button>
        </div>
      )}
    </Box>
  );
}
