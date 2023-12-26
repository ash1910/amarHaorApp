import { create } from "apisauce";
import { getData } from "../functions/AsyncStorageFunctions";
import { BACKEND_BASE } from "../config";

const Config = {
  baseURL: BACKEND_BASE,
  timeout: 90000,
};

const R3ClientWithoutAuth = create(Config);
const R3Client = create(Config);
const R3ClientFileDownload = create(Config);

R3Client.addAsyncRequestTransform(request => async () => {
  const token = await getData("token") || null;
  if (!token) return;
  request.headers["Authorization"] = "Bearer " + token;
});

R3ClientFileDownload.addAsyncRequestTransform(request => async () => {
  const token = await getData("token") || null;
  if (!token) return;
  request.headers["Authorization"] = "Bearer " + token;
  //request.headers["Content-Type"] = "multipart/form-data";
  //request.headers["enctype"] = "multipart/form-data";
  request.responseType = 'blob';
});

export { R3Client, R3ClientWithoutAuth, R3ClientFileDownload };
