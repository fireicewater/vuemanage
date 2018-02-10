const SERVER_URL = 'http://localhost:9090'
const LOGIN_URL = SERVER_URL + '/login'

export default {
    data: {
        authenticated: false
    },
    login(context, info) {
        context.$http.post(LOGIN_URL, info).then(response => {
            sessionStorage.setItem('token', response.body.token);
            sessionStorage.setItem('username', response.body.username);
            sessionStorage.setItem('role', response.body.role);
            sessionStorage.setItem('userid', response.body.userid);
            this.authenticated = true
            //跳到home页
            context.$router.push("/manager/home");
        }, function (err) {
            context.$message.error("用户名密码错误");
        })
    },
    getAuthHeader() {
        return {
            'Authorization': 'Bearer ' + sessionStorage.getItem('token')
        }
    },
    isadmin() {
        const role = sessionStorage.getItem('role');
        return role === 'admin';
    },
    checkAuth() {
        var token = sessionStorage.getItem('token')
        if (token) {
            this.authenticated = true
        } else {
            this.authenticated = false
        }
    }
}
