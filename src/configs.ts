export let mongo_url = "mongodb://admin:sajahafeel123@erp.thesellerstack.com:27017"
//'mongodb://admin:sajahafeel2216@erp.thesellerstack.com:27017'
// ubuntu@ip-172-31-44-129:~$ mongosh "mongodb://admin:N3w3r@123P4l1m3tT@123@erp.thesellerstack.com:27017"^C
export const mydb = process.env.MY_DB_NAME || 'development';  // Set a default value if not provided
export let woocommerce_url = 'https://www.catlitter.lk'