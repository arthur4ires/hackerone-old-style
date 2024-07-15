// ==UserScript==
// @name         HackerOne Redesigned Page
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  A script to switch sections in Team pages of HackerOne
// @author       A.
// @match        https://hackerone.com/*
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';
    let Phase1 = false, Phase2 = false;

    function watchURLChanges() {

        let previousURL = window.location.href;


        setInterval(function() {
            const currentURL = window.location.href;

            if (currentURL !== previousURL) {
                Phase1 = false;
                Phase2 = false;
                if (currentURL.includes("?type=team")) {
                    SwitchSections();
                }

                previousURL = currentURL;
            }
        }, 500);
    }


    const observer = new MutationObserver(function(mutationsList, observer) {
    // Loop through each mutation
    for(let mutation of mutationsList) {
        // Check if the mutation type is relevant to what you're observing (e.g., childList, attributes, etc.)
        // You can specify the types you want to observe in the options object below
        if (mutation.type === 'childList') {
            SwitchSections();
        }
    }
});

// Start observing the body element for mutations
observer.observe(document.body, {
    attributes: false, // Observe changes to attributes
    childList: true, // Observe changes to child nodes (e.g., adding or removing nodes)
    subtree: false // Observe changes in all descendants of the body
});


    function SwitchSections() {


        const sidebarElement = document.querySelector('[data-testid="team-profile-right-side-bar"]');
        const programHighlights = document.getElementById('program_highlights');

        if (sidebarElement && programHighlights) {
            sidebarElement.setAttribute('id', 'Hacker1-Sidebar');
            programHighlights.appendChild(sidebarElement);
            Phase1 = true;
        }

        const pmdDivs = document.querySelectorAll('.p-md');
        const topHackersDiv = document.getElementById('top_hackers');

        if (sidebarElement && pmdDivs.length > 0 && topHackersDiv) {
            const cards = sidebarElement.querySelectorAll('.card');
            let emptyPmdDivFound = false;

            for (let i = 0; i < pmdDivs.length; i++) {
                const pmdDiv = pmdDivs[i];

                if (pmdDiv.childElementCount === 0) {
                    cards.forEach(card => {
                        pmdDiv.appendChild(card);
                    });

                    setTimeout(() => {
                        pmdDiv.appendChild(topHackersDiv);
                    }, 50);

                    pmdDiv.setAttribute('Hacker1-custom-sidediv', '');
                    emptyPmdDivFound = true;
                    Phase2 = true;
                    break;
                }
            }
        }
    }

    watchURLChanges();



        const css = `
            #Hacker1-Sidebar {
                padding: 20px;
            }

            [Hacker1-custom-sidediv] {
            }
        `;
        GM_addStyle(css);
})


();


