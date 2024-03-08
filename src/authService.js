export function getUserDataFromToken() {
    const token = localStorage.getItem('userToken');
    if (token) {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(atob(base64));
        
        const userEmailClaimUri = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress';
        return {
            email: payload[userEmailClaimUri],
            // You can add other user details here
        };
    }
    return null;
}