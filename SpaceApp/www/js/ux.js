var state = {
    pages_hist: ['map_page'],
    menu_open: false,
    singed_in: false,
    layerchooser: false,

}

function pager(id) {
    document.querySelector(".ol-layers").style.display = 'block'
    document.querySelector(".ol-layers").classList.remove('ol-unselectable')

    if (id == "" || typeof(id) != 'string') {
        document.getElementById(state.pages_hist[state.pages_hist.length - 1]).classList.add("hidden")
        if (state.pages_hist.length > 1) state.pages_hist.pop() //limit to assure , two cases of 1, inp 1, and after pop 1
        id = state.pages_hist[state.pages_hist.length - 1]
        if (id == 'map_page') state.pages_hist = ['map_page']
    } else {
        document.getElementById(state.pages_hist[state.pages_hist.length - 1]).classList.add("hidden")
        if (id == 'map_page') state.pages_hist = []
        state.pages_hist.push(id);
    }
    document.getElementById(id).classList.remove("hidden")

    if (state.menu_open) { // no need to handle duplicates
        toogle_menu()
        state.pages_hist = ['map_page', state.pages_hist[state.pages_hist.length - 1]] // maybe will remove this later, sets to 0 if menu used
    } else if (state.pages_hist[state.pages_hist.length - 1] == 'map_page') document.getElementById("map_page_button").classList.add("hidden")
}

function toogle_menu() {
    if (state.pages_hist[state.pages_hist.length - 1] != 'map_page') document.getElementById("map_page_button").classList.remove("hidden")
    if (state.pages_hist[state.pages_hist.length - 1] == 'map_page') document.getElementById("map_page_button").classList.add("hidden")
    if (!state.menu_open) {
        document.querySelector("nav").classList.remove("nav_hidden");
        document.querySelector(".nav-bg").classList.remove("hidden");
        state.menu_open = true;
    } else {
        document.querySelector("nav").classList.add("nav_hidden");
        document.querySelector(".nav-bg").classList.add("hidden");
        state.menu_open = false;
    }
}

function soft_alert(text) {
    document.getElementById("alert").innerHTML = text;
    document.getElementById("soft_alert").classList.remove("hidden");
}

function hide_alert() {
    document.getElementById("alert").innerHTML = "";
    document.getElementById("soft_alert").classList.add("hidden");
}

function loading(what) {
    if (what) document.getElementById("soft_loading").classList.remove("hidden")
    if (!what) document.getElementById("soft_loading").classList.add("hidden")
}

function handleLogin() {
    var username = document.getElementById("login_username").value;
    var password = document.getElementById("login_password").value;
    if (username != "" && password != "") {
        loading(true)
        var response = login(username, password);
        loading(false)

        if (!response.state) {
            soft_alert(response.info);
        } else {
            //show,hide,map
            update()
            pager('map_page')
        }
    } else {

    }
}

function handleSignup(dom) {
    var username = dom.elements["username"].value
    var password = dom.elements["password"].value
    var fullname = dom.elements["fullname"].value
    if (username != "" && password != "" && fullname != "") {
        loading(true)
        var response = signup(username, password, fullname, loading);
        loading(false)

        if (!response.state) {
            soft_alert(response.info);
        } else {
            soft_alert('Account creation complete, Please log in to continue!')
            pager('login_page')
        }
    } else {

    }
    return false
}



function show() {

}

function hide(id) {
    document.getElementById(id).classList.add('hidden')
}

function hideAll(arr) {
    for (var i in arr) {
        hide(i)
    }
}

function show(id) {
    document.getElementById(id).classList.remove('hidden')
}

function showAll(arr) {
    for (var i in arr) {
        show(i)
    }
}

function hideOverlay() {
    overlay.setPosition(undefined)
    hide('extra_submission')
    show('extra_general')
}


function update() {
    var current = ping()
    state.singed_in = current.state
    show_on_in = document.querySelectorAll(".show-on-in");
    hide_on_in = document.querySelectorAll(".hide-on-in");
    if (state.singed_in) {
        render_ui_data(current.data)
        for (var i = 0; i < show_on_in.length; i++) {
            show_on_in[i].classList.remove('hidden')
        }
        for (var i = 0; i < hide_on_in.length; i++) {
            hide_on_in[i].classList.add('hidden');
        }
    } else {
        render_ui_data({ username: "Anonymous", fullname: "Guest", contrib: 0 })
        for (var i = 0; i < show_on_in.length; i++) {
            show_on_in[i].classList.add('hidden');
        }
        for (var i = 0; i < hide_on_in.length; i++) {
            hide_on_in[i].classList.remove('hidden');
        }
    }
    gov_update()
}


function render_ui_data(data) {
    document.getElementById('username').innerHTML = data.username
    document.getElementById('userfullname').innerHTML = data.fullname
    document.getElementById('contribution_points').innerHTML = data.contrib
}

function init() {
    loading(true)
    update()
    renderLeaderboard()
    loading(false)
}

function logout() {
    deleteToken()
    update()
}

function showLayerChooser() {
    if (state.layerchooser) {
        hide('layer_chooser')
    } else {
        show('layer_chooser')
    }
    state.layerchooser = !state.layerchooser
}

function native_survey(dom) {
    loading(true)
    var response = n_submit(dom, map_state.crood[1], map_state.crood[0]) //1 lat, 2 long
    if (response.state) {
        soft_alert("Submission Done!")
        dom.reset()
        pager('map_page')
    } else {
        soft_alert(response.info)
    }
    update()
    loading(false)
    return false
}

function show_submit_menu() {
    try {
        if (w.distance(map_state.loc[0], map_state.loc[1], map_state.crood[0], map_state.crood[1]) < 0.2) {
            show('extra_submission')
            hide('extra_general')
        } else {
            soft_alert("You need to be physically close to an area for submitting data");
        }
    } catch (e) {
        console.log(e);
        soft_alert("Enable geolocation to submit data");
    }
}

function report_submit(dom) {
    loading(true)
    var response = r_submit(dom, map_state.crood[1], map_state.crood[0]) //1 lat, 2 long
    if (response.state) {
        soft_alert("Submission Done! Please wait 6 hours before the point get added in the map.(Cronjob runs every 6hours)")
        dom.reset()
        pager('map_page')
    } else {
        soft_alert(response.info)
    }
    update()
    loading(false)
    return false
}

function get_help(dom) {
    var response = gt_help(dom, map_state.crood[1], map_state.crood[0]) //1 lat, 2 long
    if (response.state) {
        soft_alert("Submission Done! Please wait 10 minutes before the point get added in the map.(Cronjob runs every 5minutes)")
        dom.reset()
        pager('map_page')
    } else {
        soft_alert(response.info)
    }

    return false
}

function renderLeaderboard() {
    var res = leaderboard_data();
    var lp = document.getElementById("leaderboard_data")
    var data = ""
    if (res.state) {
        data += "<div class=\"leaderboard_cont\">"
        for (var i = 0; i < res.data.length; i++) {
            data += "<div class=\"leader\">"
            data += "<span class=\"leader_name\">"
            data += (i + 1) + '. ' + res.data[i].fullname
            data += "</span>"
            data += "<span class=\"leader_point\">"
            data += Math.round(res.data[i].contrib)
            data += "</span>"
            data += "</div>"
        }
        data += "</div>"
        lp.innerHTML = data
    } else {
        lp.innerHTML = res.info
    }
}

function yesno(val) {

}

function label(no, arr) {
    switch (no) {
        case 1:
            return arr[0]
        case .75:
            return arr[1]
        case .5:
            return arr[2]
        case .25:
            return arr[3]
        case 0:
            return arr[4]
    }
}

function cFL(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function curseParse(obj, toplevel) {
    var data = ""
    var stt_data = ""
    for (var i in obj) {
        if (typeof(obj[i]) === "object") {
            if (toplevel) {
                data += "<div>"
                data += '<span>' + cFL(i) + '</span>' + curseParse(obj[i], false)
                data += "</div>"
            }
        } else {
            if (toplevel) {
                data += "<div>"
                data += '<span>' + cFL(i) + '</span>' + obj[i]
                data += "</div>"
            } else {
                if (Number(obj[i]) == 0) {

                } else {
                    stt_data += cFL(i) + '<br>';
                }
            }
        }
    }
    if (!toplevel) return stt_data;
    return data
}

function us_render(oid) {
    var res = user_submit_info(oid)
    var data = "<div><h4>Native Submit</h4></div>"
    data += curseParse(res, true)
    document.getElementById('point_render_').innerHTML = data;
}

function ls_render(oid) {
    var res = user_report_info(oid)
    var data = "<div><h4>Prevoius Landslide</h4></div>"
    data += curseParse(res, true)
    document.getElementById('point_render_').innerHTML = data;
}

function help_render(oid) {
    var res = get_help_info(oid)
    var data = "<div><h4>Get help</h4></div>"
    data += curseParse(res, true)
    data += "<div class=\"menu-item show-to-gov\"onclick=\"handleHelp(this,'" + oid + "');\" >Mark as done</div>"
    document.getElementById('point_render_').innerHTML = data;
    gov_update()
}

function handleHelp(dom, oid) {
    loading(true)
    var ret = h_help(oid);
    if (ret.state) {
        dom.classList.add('hidden');
        hideOverlay();
        soft_alert('Done, will be updated within 10 minutes via cronjob')
    } else {
        soft_alert(ret.info)
    }
    loading(false)
}

function gov_update() {
    var show_on_in = document.querySelectorAll(".show-to-gov"); // its other
    if (window.localStorage.getItem('type') == 'gov') {
        for (var i = 0; i < show_on_in.length; i++) {
            show_on_in[i].classList.remove('hidden')
        }
    } else {
        for (var i = 0; i < show_on_in.length; i++) {
            show_on_in[i].classList.add('hidden');
        }
    }
}

function csv_sub(dom) {
    loading(true)
    var ret = csv_submit(dom)
    if (ret.state) {
        soft_alert('Submitted successfully')
        dom.reset()
    } else {
        soft_alert('Submission failed!')

    }
    loading(false)
    return false
}