const validator = require('html-validator');
const cheerio = require('cheerio');

const htmlCode = `
<!DOCTYPE html>
<html>
<head>
    <title>Sample HTML</title>
</head>
<body>
    <h1>Hello, world!</h1>
    <div>Rishi</div>
</body>
</html>
`;

class ValidateController {
    async validateHtml(req, res) {
        try {
            let points = 1;
            const htmlCode = req.body.html;
            const cssCode = req.body.css;

            // HTML Validation
            // const result = await validator({ data: htmlCode, format: 'text' });
            const $ = cheerio.load(htmlCode);
            let response = '';

            // Navbar Validation
            const navBar = $('nav');
            const navbarId = navBar.attr('id') === 'navbar';
            const navbarLink = navBar.find('a');
            if (navBar.length === 1) {
                const firstChild = $('body').children().first();
                if (!firstChild.is('nav')) {
                    response += `<p>${points++}) <strong>Navbar</strong> is not on top of viewport.<p><br>`;
                }

                if (!navbarId) {
                    response += `<p>${points++}) Navbar section do not have id <strong>"navbar".</strong></p><br>`;
                }

                if (navbarLink.length > 0) {
                    let flag = false;
                    navbarLink.each((index, element) => {
                        const href = $(element).attr('href');
                        if (href && href.startsWith('#')) {
                            flag = true;
                        }
                    });
                    if (!flag) {
                        response += `<p>${points++}) Navbar section does not have a link to navigate to any section of the portfolio.</p><br>`;
                    }
                } else {
                    response += `<p>${points++}) Navbar section does not contain any link.</p><br>`;
                }
            } else if (navBar.length > 1) {
                response += `<p>${points++}) Multiple Navbar are present.<p><br>`;
            } else {
                response += `<p>${points++}) Navbar is missing.<p><br>`;

            }

            // Welcome Section Validation
            const welcomeSec = $('#welcome-section');
            const welcomeh1Element = welcomeSec.find('h1:first');
            const welcomeh1Text = welcomeh1Element.text().trim();

            if (welcomeSec.length > 1) {
                response += `<p>${points++}) Multiple welcome sections are present</p><br>`;
            } else if (welcomeSec.length == 0) {
                response += `<p>${points++}) <strong>"Welcome section"</strong> is missing.</p><br>`;
            } else {
                if (welcomeh1Element.length == 0) {
                    response += `<p>${points++}) Welcome section does not contains <strong>h1</strong> tag.</p><br>`;
                } else {
                    if (welcomeh1Text.length == 0) {
                        response += `<p>${points++}) Welcome section heading does not contain any text.</p><br>`;
                    }
                }
            }

            // Project Section Validation
            const projectSec = $('#projects');
            const projectElem = projectSec.find('.project-tile');
            const projectLink = projectSec.find('a');
            const projectHref = projectLink.attr('href');
            if (projectSec.length > 0) {
                if (projectElem.length == 0) {
                    response += `<p>${points++}) Project section does not contain any element with class name <strong>"project-tile"</strong>.</p><br>`;
                }
                if (projectLink.length == 0) {
                    response += `<p>${points++}) Project section does not contain any link to project.</p><br>`;
                } else {
                    if (!projectHref || projectHref.length == 0) {
                        response += `<p>${points++}) Project link <strong>"href"</strong> is empty.</p><br>`;
                    }
                }
            } else {
                response += `<p>${points++}) Project section is missing.</p><br>`;
            }

            // Profile Link Validation
            const profileLink = $('#profile-link');
            const flag = profileLink.is('a#profile-link');
            if (profileLink.length > 0 && flag) {
                const href = profileLink.attr('href');
                const target = profileLink.attr('target');
                if (href && (href.startsWith('https://github.com/') || href.startsWith('https://www.freecodecamp.org/'))) {
                    if (target !== '_blank') {
                        response += `<p>${points++}) Profile link does not open in new tab.</p><br>`;
                    }
                } else {
                    response += `<p>${points++}) Profile Link does not contain link of <strong>Github</strong> or <strong>FreeCodecamp</strong> profile.</p><br>`;
                }
            } else {
                response += `<p>${points++}) Profile Link is missing.</p><br>`;
            }

            // Check if css file is present or not
            const cssFileElement = $('head').find('link[rel="stylesheet"][href="styles.css"]');
            if (cssFileElement.length == 0) {
                response += `<p>${points++}) <strong>CSS</strong> file link is missing.</p>`;
            } else {
                // Check if CSS contains the rule for #welcome-section with height: 100vh
                const welcomeSectionHeightValidation = /#welcome-section\s*{\s*[^}]*\bheight\s*:\s*100vh\s*[^}]*}/.test(cssCode);
                if (!welcomeSectionHeightValidation) {
                    response += `<p>${points++}) Welcome section does not have height equals to height of viewport.</p><br>`;
                }

                // Check if CSS contains at least one media query
                const containsMediaQuery = /@media\s*\(.+?\)\s*{/.test(cssCode);
                if (!containsMediaQuery) {
                    response += `<p>${points++}) Media query is not available.</p><br>`;
                }

            }

            if (response.length == 0) {
                response = `<p><strong>Congratulations🎉🎉</strong>! You portfolio passed all the validations.</p>`;
            }

            return res.status(200).json({ message: response });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new ValidateController();