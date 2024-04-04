export default function targetFunction (parameters : any){
    
    const order = parameters.order_data;

    //calculate cart weight
    let totalWeight = 0; //out 1
    order.line_items.map((lineItem) =>  {
        totalWeight +=(Number(lineItem.product.weight) * lineItem.quantity); 
    });
    totalWeight = Number(totalWeight.toFixed(0));

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
    
    return {
        "input" : parameters,
        "output": {
            "totalWeight" : totalWeight,
            "totalBeforeDiscounts": totalBeforeDiscounts,
            "totalLineDiscounts" : totalLineDiscounts,
            "total" : total
        }
    };
}