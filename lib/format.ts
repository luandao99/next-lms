export const formatPrice = (price:number)=>{
    return new Intl.NumberFormat("en-VN",{
        style:"currency",
        currency:"VND"
    }).format(price)
}