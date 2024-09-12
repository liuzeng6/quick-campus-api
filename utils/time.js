module.exports = {
    getTime() {
        return parseInt(Date.now() / 1000);
    },
    getDate() {
        const d_t = new Date();
        let year = d_t.getFullYear();
        let month = ("0" + (d_t.getMonth() + 1)).slice(-2);
        let day = ("0" + d_t.getDate()).slice(-2);
        return `${year}${month}${day}`;
    }
}