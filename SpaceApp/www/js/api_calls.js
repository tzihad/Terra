var authdata = {
    token: "",
    username: "",
    expires: 0
}

function saveToken(response) {
    window.localStorage.setItem('token', response.token)
    window.localStorage.setItem('username', response.data.username)
    window.localStorage.setItem('fullname', response.data.fullname)
    window.localStorage.setItem('contrib', Math.round(response.data.contrib))
    window.localStorage.setItem('type', response.data.type)
}

function deleteToken() {
    window.localStorage.removeItem('token')
    window.localStorage.removeItem('username')
    window.localStorage.removeItem('fullname')
    window.localStorage.removeItem('contrib')
    window.localStorage.removeItem('type')
}

function getToken() {
    return window.localStorage.getItem('token');
}

function getData() {
    var token = window.localStorage.getItem('token');
    var contrib = window.localStorage.getItem('contrib');
    var username = window.localStorage.getItem('username');
    var fullname = window.localStorage.getItem('fullname');
    var type = window.localStorage.getItem('type')
    return {
        token: token,
        username: username,
        fullname: fullname,
        contrib: contrib
    }
}

function ping() {
    if (localStorage.getItem('token') == null) return {
        state: false
    }
    var ret = {
        info: "",
        state: false,
        network_err: false,
        data: {}
    }
    try {
        var xhr = new XMLHttpRequest()
        xhr.open("POST", servers.submission.url + "/ping", false)
        xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('token'));
        xhr.send()
        if (xhr.readyState == XMLHttpRequest.DONE) {
            if (xhr.status == 200) {
                ret.state = true;
                ret.data = getData()
            } else {
                ret.state = false
            }
        }
    } catch (e) {
        ret.info = e;
        ret.network_err = true
    }
    return ret
}

function login(username, password) { //loading before after call
    var ret = { state: false }
    try {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", servers.submission.url + "/login", false);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.send("username=" + username + "&password=" + password);
        if (xhr.readyState == XMLHttpRequest.DONE) {
            if (xhr.status == 200) {
                ret = JSON.parse(xhr.response)
                saveToken(ret)
            } else if (xhr.status == 502) {
                ret = JSON.parse(xhr.response)
            }
        }
    } catch (e) {
        ret.info = e;
    }
    return ret;
}

function signup(username, password, fullname) { //loading before after call
    var ret = { state: false }
    try {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", servers.submission.url + "/signup", false);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.send("username=" + username + "&password=" + password + "&fullname=" + fullname);
        if (xhr.readyState == XMLHttpRequest.DONE) {
            if (xhr.status == 200) {
                ret = JSON.parse(xhr.response)
            } else if (xhr.status == 502) {
                ret = JSON.parse(xhr.response)
            }
        }
    } catch (e) {
        ret.info = e;
    }
    return ret;
}


function n_submit(dom, latitude, longtitude) {
    var ret = { state: false }
    try {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", servers.submission.url + "/native_submit", false)
        xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('token'));
        var formdata = new FormData(dom)
        formdata.set('latitude', latitude)
        formdata.set('longtitude', longtitude)
        xhr.send(formdata);
        if (xhr.readyState == XMLHttpRequest.DONE) {
            ret = JSON.parse(xhr.response);
            if (ret.contrib != undefined) window.localStorage.setItem('contrib', Math.round(ret.contrib))
        }
    } catch (e) {
        ret.state = false
        ret.info = e;
    }
    return ret;
}

function r_submit(dom, latitude, longtitude) {
    var ret = { state: false }
    try {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", servers.submission.url + "/prev_landslide", false)
        xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('token'));
        var formdata = new FormData(dom);
        formdata.set('latitude', latitude)
        formdata.set('longtitude', longtitude)
        formdata.set('time', (new Date(dom.elements["time"].value)).toISOString())
        xhr.send(formdata);
        if (xhr.readyState == XMLHttpRequest.DONE) {
            ret = JSON.parse(xhr.response);
            if (ret.contrib != undefined) window.localStorage.setItem('contrib', Math.round(ret.contrib))
        }
    } catch (e) {
        ret.state = false
        ret.info = e;
    }
    return ret;
}

function gt_help(dom, latitude, longtitude) {
    var ret = { state: false }
    try {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", servers.submission.url + "/get_help", false)
        xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('token'));
        var formdata = new FormData(dom);
        formdata.set('latitude', latitude)
        formdata.set('longtitude', longtitude)
        xhr.send(formdata);
        if (xhr.readyState == XMLHttpRequest.DONE) {
            ret = JSON.parse(xhr.response);
        }
    } catch (e) {
        ret.state = false
        ret.info = e;
    }
    return ret;
}

function leaderboard_data() {
    var ret = { state: false }
    try {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", servers.query.url + "/leaderboard", false)
        xhr.send();
        if (xhr.readyState == XMLHttpRequest.DONE) {
            ret = JSON.parse(xhr.response);
        }
    } catch (e) {
        ret.state = false
        ret.info = e;
    }
    console.log(ret)
    return ret;
}

function user_submit_info(oid) {
    var ret = { state: false }
    try {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", servers.query.url + "/us_details?id=" + oid, false)
        xhr.send();
        if (xhr.readyState == XMLHttpRequest.DONE) {
            ret = JSON.parse(xhr.response);
        }
    } catch (e) {
        ret.state = false
        ret.info = e;
    }
    return ret;
}


function user_report_info(oid) {
    var ret = { state: false }
    try {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", servers.query.url + "/ls_details?id=" + oid, false)
        xhr.send();
        if (xhr.readyState == XMLHttpRequest.DONE) {
            ret = JSON.parse(xhr.response);
        }
    } catch (e) {
        ret.state = false
        ret.info = e;
    }
    return ret;
}


function get_help_info(oid) {
    var ret = { state: false }
    try {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", servers.query.url + "/help_details?id=" + oid, false)
        xhr.send();
        if (xhr.readyState == XMLHttpRequest.DONE) {
            ret = JSON.parse(xhr.response);
        }
    } catch (e) {
        ret.state = false
        ret.info = e;
    }
    return ret;
}

function csv_submit(dom) {
    var ret = { state: false }
    try {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", servers.submission.url + "/submit_csv", false)
        xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('token'));
        var formdata = new FormData(dom);
        xhr.send(formdata);
        if (xhr.readyState == XMLHttpRequest.DONE) {
            ret = JSON.parse(xhr.response);
            if (ret.contrib != undefined) window.localStorage.setItem('contrib', Math.round(ret.contrib))
        }
    } catch (e) {
        ret.state = false
        ret.info = e
    }
    return ret;
}

function h_help(oid) {
    var ret = { state: false }
    try {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", servers.submission.url + "/handle_help", false)
        xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('token'));
        var formdata = new FormData();
        formdata.append('oid', oid)
        xhr.send(formdata);
        if (xhr.readyState == XMLHttpRequest.DONE) {
            ret = JSON.parse(xhr.response);
        }
    } catch (e) {
        ret.state = false
        ret.info = e
    }
    return ret;
}
//