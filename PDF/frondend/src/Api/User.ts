import { PdfInterface } from "../Interface/PdfInterface";
import { UserInterface } from "../Interface/UserInterface";
import { userApi } from "../Services/Axios";
import userRouter from "../Services/EndPoints";
import errorHandler from "./ErrorHandler";

// *****************Referesh Access Token***************

const refreshUserAccessToken = async () => {
    try {
        const result = await userApi.get(userRouter.refreshAccessToken)
        return result
    }
    catch (error) {
        errorHandler(error as Error)
    }
}

// ******************user Signup****************

const signupUser = async (userData: UserInterface) => {
    try {
        const result = await userApi.post(userRouter.signup, { userData })
        return result
    }
    catch (error) {
        errorHandler(error as Error)
    }
}
// ******************user Login****************

const loginUser = async (userData: UserInterface) => {
    try {
        const result = await userApi.post(userRouter.Login, { userData })
        return result
    }
    catch (error) {
        errorHandler(error as Error)
    }
}
// ******************user Logout****************

const userLogout = async () => {
    try {
        const result = await userApi.get(userRouter.Logout)
        if (result) {
            window.location.href = '/login'
        }
        return result
    }
    catch (error) {
        errorHandler(error as Error)
    }
}

// **********************fetch pdf********************888

const fetchPdf = async (userId: string): Promise<PdfInterface[]> => {
    try {
        const response = await userApi.get(userRouter.fetchPdf, { params: { userId } });
        if (!response.data) {
            throw new Error('No data found');
        }
        return response.data.data as PdfInterface[];
    } catch (error) {
        console.error('Error fetching PDFs:', error);
        return []; // Return empty array on error
    }
};


// **********************upload pdf****************

const uploadPdf = async (userId: string, formData: FormData) => {
    try {
        const result = await userApi.post(userRouter.uploadPdf, formData, {
            params: { userId },
            headers: {
                'Content-Type': 'multipart/form-data', // Required for file uploads
            },
        })
        return result.data
    }
    catch (error) {
        errorHandler(error as Error)
    }
}
// ***********************pdf details******************
const pdfDetails = async (pdfId: string) => {
    try {
        const result = await userApi(userRouter.pdfDetails, {
            params: { pdfId }
        })
        return result
    }
    catch (error) {
        errorHandler(error as Error)
    }
}

// *********************create new pdf********************

const createNewPdf = async (pdfId: string, selectedPages: any) => {
    try {
        console.log("create pdf")
        const result = await userApi.post(userRouter.createNewPdf, {
            pdfId: pdfId,
            pages: selectedPages,
        })
        return result
    }
    catch (error) {
        errorHandler(error as Error)
    }
}

export {
    refreshUserAccessToken,
    loginUser,
    signupUser,
    userLogout,
    fetchPdf,
    uploadPdf,
    pdfDetails,
    createNewPdf
}