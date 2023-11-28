import { Endpoints } from "../constants/endpoints";
import axiosInstance from "../utils/axiosInstance";

export async function getAllCourses() {
    return axiosInstance.get(Endpoints.GET_ALL_COURSES)
}