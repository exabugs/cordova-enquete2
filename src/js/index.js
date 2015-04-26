/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var chiwawa = "https://demo.chiwawa.jp";
//var chiwawa = "http://192.168.11.4:8004";

var app = {
  // Application Constructor
  initialize: function () {
    this.bindEvents();
  },
  // Bind Event Listeners
  //
  // Bind any events that are required on startup. Common events are:
  // 'load', 'deviceready', 'offline', and 'online'.
  bindEvents: function () {
    document.addEventListener('deviceready', this.onDeviceReady, false);
  },
  // deviceready Event Handler
  //
  // The scope of 'this' is the event. In order to call the 'receivedEvent'
  // function, we must explicitly call 'app.receivedEvent(...);'
  onDeviceReady: function () {
    app.receivedEvent('deviceready');

    var params = {
      url: chiwawa + "/oauth2/",
      client_id: 'cordovaHello',
      client_secret: 'chiwawaapp..secret',
      redirect_uri: 'http://chiwawa.jp/auth/callback/'
    };

    var oauthParams = {
      response_type: "code",               // required - "code"/"token"
      auth_url: params.url + "authorize",  // required
      token_url: params.url + "token",     // required if response_type = 'code'
      client_id: params.client_id,         // required
      client_secret: params.client_secret, // required if response_type = 'code'
      redirect_uri: params.redirect_uri    // required - some dummy url
      // other_params: {}        // optional params object for scope, state, display...
      // logout_url: '',         // recommended if available
    };

    $.oauth2(oauthParams,
      function (token, response) {
        // do something with token or response
        $("#logs").append("<p class='success'><b>access_token: </b>" + token + "</p>");
        $("#logs").append("<p class='success'><b>response: </b>" + JSON.stringify(response) + "</p>");
      },
      function (error, response) {
        // do something with error object
        $("#logs").append("<p class='error'><b>error: </b>" + JSON.stringify(error) + "</p>");
        $("#logs").append("<p class='error'><b>response: </b>" + JSON.stringify(response) + "</p>");
      }
    );

  },
  // Update DOM on a Received Event
  receivedEvent: function (id) {
    var parentElement = document.getElementById(id);
    var listeningElement = parentElement.querySelector('.listening');
    var receivedElement = parentElement.querySelector('.received');

    listeningElement.setAttribute('style', 'display:none;');
    receivedElement.setAttribute('style', 'display:block;');

    $.each(document.querySelectorAll('td.device'), function () {
      $(this).text(device[this.id]);
    });

    console.log('Received Event: ' + id);
  }
};

app.initialize();