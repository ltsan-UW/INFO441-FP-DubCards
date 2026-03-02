let user = undefined;

async function loadAuth(){
  console.log("loading authentication")
    let identity_div = document.getElementById("login-signup-div");

    try{
        let identityInfo = await fetchJSON(`auth/user`);

        if(identityInfo.status == "loggedin"){
            user = identityInfo.userInfo;
            identity_div.innerHTML = `
            <h2>Logged in as: ${user.name}<h2/>
            <a href="/auth/signout" role="button" class="account-buttons">Logout</a>`;
        } else { //logged out
            user = undefined;
                        identity_div.innerHTML = `
            <a href="/auth/signin" role="button" class="account-buttons">Login with Microsoft</a>`;
        }
    } catch(error){
        user = undefined;
        identity_div.innerHTML = `<div>
        <button onclick="loadAuth()">retry</button>
        Error loading identity: <span id="identity_error_span"></span>
        </div>`;
        document.getElementById("identity_error_span").innerText = error;
    }
}
