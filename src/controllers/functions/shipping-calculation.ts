export default function targetFunction (parameters : any){
    
    const order = parameters.order_data;

    //calculate cart weight
    let totalWeight = 0; //out 1
    order.line_items.map((lineItem) =>  {
        totalWeight +=parseFloat((lineItem.product.weight * lineItem.quantity).toFixed(2)); 
    });
    

    let totalBeforeDiscounts = 0; // out 2
    let totalLineDiscounts = 0 // out 3
    //calculate total line discounts and total before discounts
    order.line_items.map((lineItem) =>  {
       const lineTotal = Number(lineItem.quantity) * Number(lineItem.salePrice);
       totalBeforeDiscounts += lineTotal;
       const discountAmount = (Number(lineItem.linediscount) / 100) * lineTotal;
       totalLineDiscounts += discountAmount;
    });
    let total = totalBeforeDiscounts - totalLineDiscounts

    let shipping_charges = 0
    let payment_handling_fee= 0;
    let order_discounts = 0
    
    return {
        "input" : parameters,
        "output": {
            "totalWeight" : totalWeight.toFixed(2),
            "totalBeforeDiscounts": totalBeforeDiscounts.toFixed(2),
            "totalLineDiscounts" : totalLineDiscounts.toFixed(2),
            "total" : total.toFixed(2),
            "shipping_charges" : shipping_charges.toFixed(2),
            "payment_handling_fee" : payment_handling_fee.toFixed(2),
            "order_discounts" : order_discounts.toFixed(2),
        }
    };
}