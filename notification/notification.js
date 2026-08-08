const sendNotification = async (employee_id, message) => {
    // هنا تربطي Firebase أو أي service
    console.log("Notify employee:", employee_id);
    console.log("Message:", message);
};



module.exports = { sendNotification};