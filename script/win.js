/** Gallery zooming */
(function() {
    //store current image
    var currentImage,
        allImages = [],
        inProgress = false;
    
    //zooming behaviour
    var zoomBehaviour = function zoomBehaviour(event) {
        event.preventDefault();
        //block functions when executing
        if (!inProgress) {
            inProgress = true;
            //get image path and unfade zoom element
            var image = this.children[0].getAttribute("src"),
                zoomElement = document.getElementById("zoomElement"),
                zoomItem = document.getElementById("zoomItem");
            currentImage = this.parentNode.id;
            image = image.replace("/min/", "/max/");
            image = image.replace("/med/", "/max/");
            zoomItem.style.backgroundImage = "url('" +  image + "')";
            zoomElement.style.zIndex = 10;
            tools.unfade(zoomElement, function() {inProgress = false;});
            //add closing zoom element on click
            zoomElement.onclick = function() {
                if (!inProgress) {
                    inProgress = true;
                    tools.fade(this, function() {inProgress = false;});
                }
            }
        }
    }
    
    //swithching images behaviour
    var switchImage = function switchImage(direction) {
        //block functions when executing
        if (!inProgress) {
            inProgress = true;
            tools.fade(zoomItem, function() {
                //get current image
                var length = allImages.length;
                while (length--) {
                    if (allImages[length] === currentImage) {
                        break;
                    }
                }
                //get image to show after click
                if (direction === "next") {
                    currentImage = allImages[length - 1];
                } else if (direction === "back") {
                    currentImage = allImages[length + 1];
                }
                if (!currentImage && direction === "next") {
                    currentImage = allImages[allImages.length - 1]
                } else if (!currentImage && direction === "back") {
                    currentImage = allImages[0]
                }
                //change image
                var image = document.getElementById(currentImage).children[0].children[0].getAttribute("src");
                image = image.replace("/min/", "/max/");
                image = image.replace("/med/", "/max/");
                zoomItem.style.backgroundImage = "url('" +  image + "')";
                tools.unfade(zoomItem, function() {inProgress = false;});
            });
        }
    }

    //create zoom box if does not exist and attach zooming behaviour to each gallery cell
    var createZoomBox = function createZoomBox() {
        if (!document.getElementById("zoomElement")) {
            //create and get elements
            var zoomElement = document.createElement("div"),
                zoomBackground = document.createElement("div"),
                zoomItem = document.createElement("div"),
                nextButton = document.createElement("div"),
                backButton = document.createElement("div"),
                closeButton = document.createElement("div"),
                bodyElement = document.getElementsByTagName("body")[0];
                
            //name elements and set positions
            zoomElement.id = "zoomElement";
            zoomItem.id = "zoomItem";
            zoomElement.style.position = "fixed";
            zoomBackground.style.position = zoomItem.style.position = "absolute";
            
            //set visibility
            zoomElement.style.visibility = "hidden";
            zoomElement.style.zIndex = -1;
            zoomBackground.style.zIndex = 0;
            zoomItem.style.zIndex = 1;
            
            //set sizes
            zoomElement.style.top = zoomBackground.style.top = 0;
            zoomElement.style.right = zoomBackground.style.right = 0;
            zoomElement.style.bottom = zoomBackground.style.bottom = 0;
            zoomElement.style.left = zoomBackground.style.left = 0;
            zoomItem.style.top = '10%';
            zoomItem.style.right = '10%';
            zoomItem.style.bottom = '10%';
            zoomItem.style.left = '10%';
            
            //set background of zoom box
            zoomBackground.style.backgroundColor = 'white';
            zoomBackground.style.backgroundImage = "url('style/graphics/loading.gif')";
            zoomBackground.style.backgroundRepeat = "no-repeat";
            zoomBackground.style.backgroundPosition = "center";
            zoomBackground.style.opacity = 0.6;
            
            //set initial image properties
            zoomItem.style.backgroundSize = "contain";
            zoomItem.style.backgroundPosition = "center";
            zoomItem.style.backgroundRepeat = "no-repeat";
            
            //navigation buttons
            nextButton.style.position = backButton.style.position = "fixed";
            nextButton.style.top = backButton.style.top = "calc(50% - 100px)";;
            nextButton.style.height = backButton.style.height = "200px"; 
            nextButton.style.width = backButton.style.width = "50px";
            nextButton.style.backgroundSize = "contain";
            nextButton.style.backgroundPosition = "center";
            nextButton.style.backgroundRepeat = "no-repeat";
            nextButton.style.backgroundImage = "url('style/graphics/zoomNext.png')";
            nextButton.style.right = backButton.style.left = 0;
            backButton.style.backgroundSize = "contain";
            backButton.style.backgroundPosition = "center";
            backButton.style.backgroundRepeat = "no-repeat";
            backButton.style.backgroundImage = "url('style/graphics/zoomBack.png')";
            
            //fake close button (clicking zoom box outside navigation button also closes it)
            closeButton.style.position = "fixed";
            closeButton.style.top = closeButton.style.right = 0;
            closeButton.style.width = closeButton.style.height = "50px";
            closeButton.style.backgroundSize = "cover";
            closeButton.style.backgroundPosition = "center";
            closeButton.style.backgroundRepeat = "no-repeat";
            closeButton.style.backgroundImage = "url('style/graphics/zoomClose.png')";
            
            //stack all elements together and put it into body
            zoomElement.appendChild(zoomBackground);
            zoomElement.appendChild(zoomItem);
            zoomElement.appendChild(nextButton);
            zoomElement.appendChild(backButton);
            zoomElement.appendChild(closeButton);
            bodyElement.appendChild(zoomElement);
            
            //add gallery images zooming bahaviour
            var galleryCells = document.querySelectorAll(".galleryCell"),
                length = galleryCells.length;    
            while (length--) {
                //assign zooming behaviour to each gallery cell image (expects img with attribute src inside a  tag insede .galleryCell)
                galleryCells[length].children[0].addEventListener("click", zoomBehaviour);
                //store ids of every image
                allImages.push(galleryCells[length].id);
            }
            
            //add navigation buttons behaviour
            nextButton.addEventListener("click", function(event) {
                event.stopPropagation();
                switchImage("next");
            });
            backButton.addEventListener("click", function(event) {
                event.stopPropagation();
                switchImage("back");
            });
        }
    }
    
    //remove zoom box if exists and remove zooming behaviour from each gallery cell
    var removeZoomBox = function removeZoomBox() {
        if (document.getElementById("zoomElement")) {
            var zoomElement = document.getElementById("zoomElement");
            zoomElement.parentNode.removeChild(zoomElement);
            var galleryCells = document.querySelectorAll(".galleryCell"),
                length = galleryCells.length;
            while (length--) {
                galleryCells[length].children[0].removeEventListener("click", zoomBehaviour);
            }
        }
    }
    
    //create zoom box if screen is large enough
    if (window.innerWidth > 480) {
        createZoomBox();
    }
    
    //add corrections on resize
    window.addEventListener("resize", function() {
        if (window.innerWidth > 480) {
            createZoomBox();
        } else {
            removeZoomBox();
        }
    });
})();
/** End gallery zooming */

/** Fading links */
(function() {
    /**
     * added to the begining of the body for chrome smooth unfade and show effect
     * document.querySelector("body").style.visibility = "hidden";            
     */
    
    //elemens which have fixed position (for IE11 fading)
    var fixedElements = [
            "body > nav",
            "header > div",
            "#facebook img",
            "#twitter img",
            "#youtube img",
            "#googleplus img",
            "#contact",
            "#search",
            "#sidebox"
        ],
        navigationList = document.querySelector("body > nav > ul").children,
        subnavigationList = document.querySelector("body > section > nav > ul").children,
        headerLanguages = document.querySelector("header > div").children;
            
    //fade page effect
    var fadePage = function fadePage(link) {
        //check if browser is IE11 if so unfade fixed elements as they do not unfade like in other browsers
        if ((Object.hasOwnProperty.call(window, "ActiveXObject") && !window.ActiveXObject) || navigator.userAgent.indexOf("Edge") !== -1) {
            var length = fixedElements.length;
            while (length--) {
                tools.fade(document.querySelector(fixedElements[length]));
            }
        }
        tools.fade(document.querySelector("body"), function(){location.replace(link)});
    }
    
    //unfade page effect
    var unfadePage = function unfadePage() {
        //check if browser is IE11 if so unfade fixed elements as they do not unfade like in other browsers
        if ((Object.hasOwnProperty.call(window, "ActiveXObject") && !window.ActiveXObject) || navigator.userAgent.indexOf("Edge") !== -1) {
            var length = fixedElements.length;
            while (length--) {
                tools.unfade(document.querySelector(fixedElements[length]));
            }
        }
        tools.unfade(document.querySelector("body"));    
    }
    
    //push page to browser history and call fading page
    var historyAndFade = function historyAndFade(event) {
        event.preventDefault();
        var link = this.getAttribute("href");
        history.pushState(null, document.title, window.location.href);
        fadePage(link);
    }
    
    //get navigation and header buttons and attach fading effect on click
    var addFadingEffect = function addFadingEffect() {
        length = navigationList.length;
        while (length--) {
            navigationList[length].children[0].addEventListener("click", historyAndFade);
        }
        length = subnavigationList.length;
        if (subnavigationList.length) {
            while (length--) {
                subnavigationList[length].children[0].addEventListener("click", historyAndFade);
            }
        }
        if (headerLanguages.length) {
            length = headerLanguages.length;
            while (length--) {
                headerLanguages[length].addEventListener("click", historyAndFade);
            }
        }
    }
    
    //get navigation and header buttons and remove fading effect on click
    var removeFadingEffect = function removeFadingEffect() {
        length = navigationList.length;
        while (length--) {
            navigationList[length].children[0].removeEventListener("click", historyAndFade);
        }
        length = subnavigationList.length;
        if (subnavigationList.length) {
            while (length--) {
                subnavigationList[length].children[0].removeEventListener("click", historyAndFade);
            }
        }
        if (headerLanguages.length) {
            length = headerLanguages.length;
            while (length--) {
                headerLanguages[length].removeEventListener("click", historyAndFade);
            }
        }
    }
    
    //firefox browser go back force to fire javascript
    window.onunload = function() {};    
    
    //add fading to links if device is large enough
    if (window.innerWidth > 480) {
        unfadePage();
        addFadingEffect();
    } else {
        tools.show(document.querySelector("body"))
    }
    
    //add corrections on resize
    window.addEventListener("resize", function() {
        if (window.innerWidth > 480) {
            addFadingEffect();
        } else {
            removeFadingEffect();
        }
    });
})();
/** End fading links */

/** Stack menu */
(function() {
    //prepare desktop view
    var makeLayoutFixed = function makeLayoutFixed() {
        var navigation = document.querySelector("body > nav"),
            section = document.querySelector("body > section"),
            article = document.querySelector("body > section > article"),
            activeNavigationElement = document.querySelector("body > nav > ul > li.active"),
            navigationElements = document.querySelector("body > nav > ul").children,
            windowWidth = window.innerWidth,
            windowHeight = window.innerHeight,
            length = navigationElements.length, size, maxSize, sectionStyle;
        
        article.style.minHeight = windowHeight + "px";
        sectionStyle = window.getComputedStyle(section) || section.currentStyle;
        size = parseInt(windowHeight / (length-1)) - 3;
        maxSize = parseInt((windowWidth - parseInt(sectionStyle.width)) / 2) - 25;
        size = maxSize > size ? size : maxSize;
        scrollBarCorrection = 8;
        navigation.style.position = "fixed";
        if (activeNavigationElement) {activeNavigationElement.style.position = "fixed";}
        while (length--) {
            navigationElements[length].children[0].style.height = size;
            navigationElements[length].children[0].style.width = size - 10;
            if (navigationElements[length].children[0].children[0]) {
                navigationElements[length].children[0].children[0].style.height = size;
                navigationElements[length].children[0].children[0].style.width = size;
                navigationElements[length].children[0].children[2].style.height = size;
                navigationElements[length].children[0].children[2].style.width = size;
            }
        }
        navigation.style.width = size;
        navigation.style.right = parseInt((windowWidth - parseInt(sectionStyle.width)) / 2) - size - 15 - scrollBarCorrection;
        if (activeNavigationElement) {
            activeNavigationElement.style.left = parseInt((windowWidth - parseInt(sectionStyle.width)) / 2) - size - 15 - scrollBarCorrection;
            activeNavigationElement.style.width = size;
        }
    }
    
    //prepare mobile view
    var makeLayoutStatic = function makeLayoutStatic() {
        var navigation = document.querySelector("body > nav"),
            activeNavigationElement = document.querySelector("body > nav > ul > li.active"),
            navigationElements = document.querySelector("body > nav > ul").children,
            length = navigationElements.length;
        navigation.style.position = "static";
        if (activeNavigationElement) {activeNavigationElement.style.position = "absolute";}
        while (length--) {
            navigationElements[length].children[0].style.height = 200;
            navigationElements[length].children[0].style.width = 190;
            if (navigationElements[length].children[0].children[0]) {
                navigationElements[length].children[0].children[0].style.height = 200;
                navigationElements[length].children[0].children[0].style.width = 200;
                navigationElements[length].children[0].children[2].style.height = 200;
                navigationElements[length].children[0].children[2].style.width = 200;
            }
        }
        navigation.style.width = 200;
        navigation.style.right = "initial";
        if (activeNavigationElement) {
            activeNavigationElement.style.left = 0;
            activeNavigationElement.style.width = 200;
        }
    }
    
    //add fading to links if device is large enough
    if (window.innerWidth > 995) {
        makeLayoutFixed();
    } else {
        makeLayoutStatic();
    }
    
    //add corrections on resize
    window.addEventListener("resize", function() {
        if (window.innerWidth > 995) {
            makeLayoutFixed();
        } else {
            makeLayoutStatic();
        }
    });
})();
/** End stack menu */

/** Sidebox */
(function() {
    if (document.getElementById("sidebox") !== null) {
        //get sidebox
        var sidebox = document.getElementById("sidebox"),
            preElement = document.querySelector("#sidebox div pre"),
            preElementContainer = document.querySelector("#sidebox div"),
            sideboxUpButton = document.createElement("div"),
            sideboxDownButton = document.createElement("div");
            
        //wrap too long pre text and prepare pre text container
        preElement.style.whiteSpace = "pre-wrap";
        preElement.style.position = "absolute";
        preElement.style.width = "100%";
        preElementContainer.style.position = "relative";
        preElementContainer.style.width = preElementContainer.style.height = "100%";
        preElementContainer.style.overflow = "hidden";
        
        //added to include hover smooth hover effect    
        sideboxUpButton.id = "sideboxButton"; 
        sideboxDownButton.id = "sideboxButton";
        sideboxUpButton.style.position = sideboxDownButton.style.position = "absolute";
        sideboxUpButton.style.height = sideboxDownButton.style.height = 15;
        sideboxUpButton.style.width = sideboxDownButton.style.width = "100%";
        sideboxUpButton.style.top = -15;
        sideboxDownButton.style.bottom = -15;
        sideboxUpButton.style.backgroundSize = sideboxDownButton.style.backgroundSize = "100% 100%";
        sideboxUpButton.style.backgroundPosition = sideboxDownButton.style.backgroundPosition = "center";
        sideboxUpButton.style.backgroundRepeat = sideboxDownButton.style.backgroundRepeat = "no-repeat";
        sideboxUpButton.style.backgroundImage = "url('style/graphics/winSideboxUp.png')";
        sideboxDownButton.style.backgroundImage = "url('style/graphics/winSideboxDown.png')";
        sidebox.appendChild(sideboxUpButton);
        sidebox.appendChild(sideboxDownButton);
                
        //add moving pre element behaviour
        var moveElement = function moveElement(direction) {
                var preElementStyle = window.getComputedStyle(preElement) || preElement.currentStyle,
                    top = preElementStyle.top === "auto" ? 0 : parseInt(preElementStyle.top),
                    visiblePreText = parseInt(sidebox.style.height),
                    allPreText = parseInt(preElementStyle.height),
                    step = 5,
                    moved = 0,
                    moveUp = function moveUp() {
                        top += step;
                        moved += step;
                        if (moved < visiblePreText/1.5 && top <= 0) {
                            preElement.style.top = top;
                            setTimeout(moveUp, 1);
                        }
                    },
                    moveDown = function moveDown() {
                        top -= step;
                        moved += step;
                        if (moved < visiblePreText/1.5 && - top <= allPreText - visiblePreText) {
                            preElement.style.top = top;
                            setTimeout(moveDown, 1);
                        }
                    };
                
                //execute proper function
                if (direction === "up") {
                    moveUp();
                } else if (direction === "down") {
                    moveDown();
                }
            };
            function makeSideboxFixed() {
                var sidebox = document.getElementById("sidebox"),
                    navigationElements = document.querySelector("body > nav > ul").children,
                    section = document.querySelector("body > section"),
                    sectionStyle = window.getComputedStyle(section) || section.currentStyle,
                    windowWidth = window.innerWidth,
                    windowHeight = window.innerHeight,
                    length = navigationElements.length,
                    size = parseInt(windowHeight / (length-1)) - 3,
                    maxSize = parseInt((windowWidth - parseInt(sectionStyle.width)) / 2) - 25,
                    size = maxSize > size ? size : maxSize,
                    scrollBarCorrection = 8,
                    activeNavigationElement = document.querySelector("body > nav > ul > li.active");
                
                if (window.innerWidth > 995) {    
                    sidebox.style.position = "fixed";     
                    sidebox.style.width = size - 10;
                    if (activeNavigationElement) {
                        sidebox.style.height = windowHeight - size - 50;
                    } else {
                        sidebox.style.height = windowHeight - 50;
                    }
                    sidebox.style.left = parseInt((windowWidth - parseInt(sectionStyle.width)) / 2) - size - 20 - scrollBarCorrection;
                    if (activeNavigationElement) {
                        sidebox.style.top = size + 20;
                    } else {
                        sidebox.style.top = 20;
                    }
                    sidebox.style.padding = 5;
                } else {
                    sidebox.style.position = "absolute";     
                    sidebox.style.width = 200;
                    sidebox.style.height = windowHeight - size - 70;
                    sidebox.style.left = -205;
                    sidebox.style.top = 220;
                    sidebox.style.padding = 0;
                }
            };
            makeSideboxFixed();
        
        sideboxDownButton.onclick = function() {
            moveElement("down");
            
        }
        sideboxUpButton.onclick = function() {
            moveElement("up");
        }
        
        //add corrections on resize
        window.addEventListener("resize", function(){
            makeSideboxFixed();
        });
        
        //add sidebox move element
        var mouseWheelHandler = function mouseWheelHandler(e) {
	        // cross-browser wheel delta
	        var e = window.event || e, // old IE support
	            delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
	        if (e.preventDefault) {
                e.preventDefault();
            } else {
                e.returnValue = false;
            }
	        if (delta === 1) {
	            moveElement("up");
	        } else {
	            moveElement("down");
	        }
        }
        
        //attach mouse scroll event handler
        if (sidebox.addEventListener) {
	        // IE9, Chrome, Safari, Opera
	        sidebox.addEventListener("mousewheel", mouseWheelHandler, false);
	        // Firefox
	        sidebox.addEventListener("DOMMouseScroll", mouseWheelHandler, false);
        } else {
            // IE 6/7/8
            sidebox.attachEvent("onmousewheel", mouseWheelHandler);
        }
    }
})();
/** End Sidebox */

/** Contact box */
(function() {
    //prevent regular form submission and send ajax request (expects submit button inside fieldset inside form)
    var ajaxContact = function ajaxContact(event) {
        event.preventDefault();
        var action = this.parentElement.parentElement.getAttribute("action"),
            userEmail = document.querySelector("#contact input[name=userEmail]").value,
            userMessage = document.querySelector("#contact textarea[name=userMessage]").value,
            recieverEmail = document.querySelector("#contact input[name=recieverEmail]").value,
            parameters = "";
        
        //if user filled up contact form send ajax request
        if (userEmail || userMessage) {
            parameters += "userEmail=" + userEmail;
            parameters += "&userMessage=" + userMessage;
            parameters += "&recieverEmail=" + recieverEmail;
            
            //send ajax request and process response
            action = action.replace("&request=page", "&request=ajax");
            tools.ajax(action, parameters, function(response) {
                var response = JSON.parse(response);
                alert(response.message);
                if (response.error === 0) {
                    document.querySelector("#contact input[name=userEmail]").value = "";
                }
            });
        }
    }
    
    //create side contact box
    var CreateSideContactbox = function CreateSideContactbox() {
        if (
            document.getElementById("contact") !== null &&
            document.getElementById("contact").parentNode.nodeName === "SECTION" &&
            !document.getElementById("contactButton")
        ) {
            //get contact box
            var contactBox = document.getElementById("contact"),
                contactButton = document.createElement("div"),
                boxWidth = 300,
                topCorrection = 0;
                
            //create contact button and append it to contact form  
            contactButton.id = "contactButton"; 
            contactButton.style.width = contactButton.style.height = 50;
            contactButton.style.position = "absolute";
            contactButton.style.top = 0;
            contactButton.style.left = -50;       
            contactButton.style.backgroundSize = "cover";
            contactButton.style.backgroundPosition = "center";
            contactButton.style.backgroundRepeat = "no-repeat";
            contactButton.style.backgroundImage = "url('style/graphics/winContact.jpg')";
            contactBox.style.position = "fixed";
            contactBox.style.width = boxWidth;
            contactBox.style.right = - boxWidth - 10;
            if (document.querySelector("section > #sidebox") === null) {
                topCorrection += 60;
            }
            contactBox.style.top = 10 - topCorrection;
            contactBox.style.backgroundColor = "#b8f5e8";
            contactBox.style.padding = 5;
            contactBox.style.boxShadow = "2px 2px 4px black";
            contactBox.setAttribute("data-folded", "true");
            contactBox.style.zIndex = 4;
            contactBox.appendChild(contactButton);
            
            //add sliding behavoiur
            contactButton.onclick = function() {
                var searchButton = document.getElementById("searchButton"),
                    sideboxButton = document.getElementById("sideboxButton");
                
                tools.slide(this);
                if (searchButton) tools.slide(searchButton, true);
                if (sideboxButton) tools.slide(sideboxButton, true);
            }
        }
    }
    
    //create regular sidebox and remove additional behaviour
    var CreateRegularContactbox = function CreateRegularContactbox() {
        if (
            document.getElementById("contact") !== null &&
            document.getElementById("contact").parentNode.nodeName === "SECTION" &&
            document.getElementById("contactButton")
        ) {
            //get contact box and remove sliding behaviour
            var contactBox = document.getElementById("contact");
            contactBox.style.position = "static";
            contactBox.style.width = "100%";
            contactBox.style.right = 0;
            contactBox.style.top = 0;
            contactBox.style.background = "none";
            contactBox.style.padding = 0;
            contactBox.style.boxShadow = "none";
            contactBox.removeAttribute("data-folded");
            contactBox.style.zIndex = 0;
            contactBox.removeChild(document.getElementById("contactButton"));
        }
    }
    
    //add submiting contact form via ajax if exists
    if (document.getElementById("contact") !== null) {
        document.querySelector("#contact input[type=submit]").addEventListener("click", ajaxContact);
    }
    
    //create interactive sidebox if device is large enough
    if (window.innerWidth > 640) {
        CreateSideContactbox();
    } else {
        CreateRegularContactbox();
    }
    
    //add corrections on resize
    if (document.getElementById("contact") !== null && document.getElementById("contact").parentNode.nodeName === "SECTION") {
        window.addEventListener("resize", function() {
            if (window.innerWidth > 640) {
                CreateSideContactbox();
            } else {
                CreateRegularContactbox();
            }
        });
    }
})();
/** End contact box */

/** Search box */
(function() {
    //elemens which have fixed position (for IE11 fading)
    var fixedElements = [
            "body > nav",
            "header > div",
            "#facebook img",
            "#twitter img",
            "#youtube img",
            "#googleplus img",
            "#contact",
            "#search",
            "#sidebox"
        ];
    
    //prevent regular form submission and send ajax request (expects submit button inside fieldset inside form)
    var ajaxSearch = function ajaxSearch(event) {
        event.preventDefault();
        var action = this.parentElement.parentElement.getAttribute("action"),
            searchPattern = document.querySelector("#search input[name=search]").value,
            parameters = "",
            listElementContainer = document.querySelector("#search ul");
        
        //populate search list with result
        var addSearchElements = function addSearchElements() {
            //if user filled up search form send ajax request
            if (searchPattern) {
                parameters += "search=" + searchPattern;
                
                //send ajax request and process response
                action = action.replace("&request=page", "&request=ajax");
                tools.ajax(action, parameters, function(response) {
                    var response = JSON.parse(response),
                        existingSearchListElements = document.getElementsByClassName("searchListElement"),
                        length;
                    
                    //delete existing search elements results
                    length = existingSearchListElements.length;
                    while (length--) {
                        existingSearchListElements[length].parentNode.removeChild(existingSearchListElements[length]);
                    }
                    
                    //process response
                    if (response.error === "" && response.results.length > 0) {
                        var listElementContainer = document.querySelector("#search ul"),
                            listElement,
                            linkElement,
                            textElement;
                            
                        //add new search elements results
                        length = response.results.length;   
                        while (length--) {
                            //create list elements
                            listElement = document.createElement("li");
                            linkElement = document.createElement("a");
                            
                            //assign onlcick behaviour
                            linkElement.onclick = function(event) {
                                //if screen is large add fading behaviour
                                if (window.innerWidth > 480) {
                                    event.preventDefault();
                                    var link = this.getAttribute("href");
                                    history.pushState(null, document.title, window.location.href);
                                    //check if browser is IE11 if so unfade fixed elements as they do not unfade like in other browsers
                                    if ((
                                        Object.hasOwnProperty.call(window, "ActiveXObject") && 
                                        !window.ActiveXObject) || 
                                        navigator.userAgent.indexOf("Edge") !== -1
                                    ) {
                                        var length = fixedElements.length;
                                        while (length--) {
                                            tools.fade(document.querySelector(fixedElements[length]));
                                        }
                                    }
                                    tools.fade(document.querySelector("body"), function(){location.replace(link)});
                                }
                            }
                            //attach elements to list
                            textElement = document.createTextNode(response.results[length].title);
                            listElement.classList.add("searchListElement");
                            linkElement.href = (response.baseUrl + response.results[length].buttonId);
                            linkElement.appendChild(textElement);                        
                            listElement.appendChild(linkElement);                        
                            listElementContainer.appendChild(listElement);
                        }
                        
                        //unfold (show for small screens) search results list
                        if (window.innerWidth > 480) {
                            tools.unfold(listElementContainer);
                        } else {
                            tools.show(listElementContainer);
                        }
                    } else {
                        alert(response.error);
                    }
                });
            }
        }
        
        //fold (hide for small screens) search results list and unfold it (show for small screens) when ready
        if (window.innerWidth > 480) {   
            tools.fold(listElementContainer, addSearchElements);
        } else {
            tools.hide(listElementContainer, addSearchElements);
        }
    }
    
    //create side search box
    var CreateSideSearchbox = function CreateSideSearchbox() {
        if (
            document.getElementById("search") !== null &&
            !document.getElementById("searchButton")
        ) {
            //get search box and add 
            var searchBox = document.getElementById("search"),
                searchButton = document.createElement("div"),
                boxWidth = 300,
                topCorrection = 0;
                
            //create search button and append it to search form  
            searchButton.id = "searchButton";
            searchButton.style.width = searchButton.style.height = 50;
            searchButton.style.position = "absolute";
            searchButton.style.top = 0;
            searchButton.style.left = -50;
            searchButton.style.backgroundSize = "cover";
            searchButton.style.backgroundPosition = "center";
            searchButton.style.backgroundRepeat = "no-repeat";
            searchButton.style.backgroundImage = "url('style/graphics/winSearch.jpg')";
            searchBox.style.position = "fixed";
            searchBox.style.width = boxWidth;
            searchBox.style.right = - boxWidth - 10;
            if (document.querySelector("section > #sidebox") === null) {
                topCorrection += 60;
            }
            if (document.querySelector("section > #contact") === null) {
                topCorrection += 60;
            }
            searchBox.style.top = 70 - topCorrection;
            searchBox.style.backgroundColor = "#b8f5e8";
            searchBox.style.padding = 5;
            searchBox.style.boxShadow = "2px 2px 4px black";
            searchBox.style.zIndex = 5;
            searchBox.setAttribute("data-folded", "true");
            searchBox.appendChild(searchButton);
            
            //add sliding behavoiur
            searchButton.onclick = function() {
                var contactButton = document.getElementById("contactButton"),
                    sideboxButton = document.getElementById("sideboxButton");
                tools.slide(this);
                if (contactButton) tools.slide(contactButton, true);
                if (sideboxButton) tools.slide(sideboxButton, true);
            }
        }
    }
    
    //create regular side box and remove additional behaviour
    var CreateRegularSearchbox = function CreateRegularSearchbox() {
        if (
            document.getElementById("search") !== null &&
            document.getElementById("searchButton")
        ) {
            //get search box and remove sliding behaviour
            var searchBox = document.getElementById("search");
            searchBox.style.position = "static";
            searchBox.style.width = "100%";
            searchBox.style.right = 0;
            searchBox.style.top = 0;
            searchBox.style.background = "none";
            searchBox.style.padding = 0;
            searchBox.style.boxShadow = "none";
            searchBox.removeAttribute("data-folded");
            searchBox.style.zIndex = 0;
            searchBox.removeChild(document.getElementById("searchButton"));
        }
    }    
    
    //add submiting contact form via ajax if exists
    if (document.getElementById("search") !== null) {
        document.querySelector("#search input[type=submit]").addEventListener("click", ajaxSearch);
    }
    
    //create interactive sidebox if device is large enough
    if (window.innerWidth > 640) {
        CreateSideSearchbox();
    } else {
        CreateRegularSearchbox();
    }
    
    //add corrections on resize
    if (document.getElementById("search") !== null) {
        window.addEventListener("resize", function() {
            if (window.innerWidth > 640) {
                CreateSideSearchbox();
            } else {
                CreateRegularSearchbox();
            }
        });
    }
})();
/** End search box */

/** Facebook, twitter, youtube, google plus, linkedin, github */
(function() {
    var socialMedia = ["facebook", "twitter", "youtube", "googleplus", "linkedin", "github"],
        additionalElements = ["sidebox", "contact", "search"];

    //make social media links fixed
    var makeLinksFixed = function makeLinksFixed() {
        var additionalElementslength = additionalElements.length,        
            socialMedialength = socialMedia.length,
            partiaLength,
            element;
        while (socialMedialength--) {
            element = document.getElementById(socialMedia[socialMedialength]),
            topCorrection = 0;
            if (element) {
                element.style.position = "fixed";
                element.style.right = 0;
                element.style.margin = 0;
                element.style.zIndex = 6;
                //compensate top value depending on existance of search contact and sidebox
                while (additionalElementslength--) {
                    if (document.querySelector("section > #" + additionalElements[additionalElementslength]) === null) {
                        topCorrection += 60;
                    }
                }
                //compensate top value depending on existance of other social media buttons (but only those above)
                partiaLength = socialMedialength;
                while (partiaLength--) {
                    if (document.querySelector("section > #" + socialMedia[partiaLength]) === null) {
                        topCorrection += 60;
                    }
                }
                additionalElementslength = additionalElements.length;
                element.style.top = 130 + socialMedialength * 60 - topCorrection;
            }
        }
    }
    
    //make social media links static
    var makeLinksStatic = function makeLinksStatic() {
        var length = socialMedia.length,
            element;
        while (length--) {
            element = document.getElementById(socialMedia[length]);
            if (element) {
                element.style.position = "static";
                element.style.right = "0";
                element.style.margin = "0";
                element.style.zIndex = "0";
                element.style.top = "0";
            }
        }
    }
    
    //position social media links if device is large enough
    if (window.innerWidth > 640) {
        makeLinksFixed();
    } else {
        makeLinksStatic();
    }
    
    //add corrections on resize
    window.addEventListener("resize", function() {
        if (window.innerWidth > 640) {
            makeLinksFixed();
        } else {
            makeLinksStatic();
        }
    });
})();
/** End facebook, twitter, youtube, google plus, linkedin, github */
