export const fieldValidators ={
    isEmailValid(email: string){
        return email.includes("@")
    },

    isDateValid(date:string){
        return /^\d{4}-\d{2}-\d{2}$/.test(date);
    },

    
}