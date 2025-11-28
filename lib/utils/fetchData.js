export async function getPayment() {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payment?page=1&limit=10`, {
            cache: 'no-store'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return {
            data: result.data || [],
            pagination: result.pagination || null
        };
    } catch (error) {
        console.error('Failed to fetch payments: ', error);
        return {
            data: [],
            pagination: null
        };
    }
}

export async function getData() {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/customer`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Failed to fetch customer data: ', error);
        return { success: false, message: 'Failed to fetch data' };
    }
}