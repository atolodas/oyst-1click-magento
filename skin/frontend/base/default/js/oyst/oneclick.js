/**
 * This file is part of Oyst_OneClick for Magento.
 *
 * @license http://www.apache.org/licenses/LICENSE-2.0 Apache License, Version 2.0
 * @author Oyst <plugin@oyst.com> <@oyst>
 * @category Oyst
 * @package Oyst_OneClick
 * @copyright Copyright (c) 2017 Oyst (http://www.oyst.com)
 */

/**
 * OneClick Customs JS
 */
"use strict";

/**
 * Main function to init 1-Click
 *
 * @param {String} productId Product Id
 * @param {null|String} childId Configurable product child id passed when configurable has only one child
 * @param {String} oneClickUrl  Backend conf oneclick payment url
 * @param {Boolean} isProductAddtocartFormValidate  Backend conf to validate or not form data
 */
function oystOneClick(productId, childId, oneClickUrl, isProductAddtocartFormValidate) {
    window.__OYST__ = window.__OYST__ || {};
    window.__OYST__.getOneClickURL = function (cb, opts) {
        opts = opts || {};

        ready(function () {
            var qty = 1;
            if ($$("input[name='qty']").length) {
                qty = $$("input[name='qty']")[0].value;
            }

            var form = new FormData();
            form.append("productId", productId);
            form.append("quantity", qty);

            if ("function" === typeof customGetConfigurableProductChildId) {
                // [Hook] This function allow anyone to use custom function to retrieve configurable product child id
                var configurableProductChildId = customGetConfigurableProductChildId();
            } else {
                var configurableProductChildId = (null !== childId) ? childId : getConfigurableProductChildId();
            }

            form.append("configurableProductChildId", configurableProductChildId);
            form.append("preload", opts.preload);
            form.append("customOptions", JSON.stringify(configurableProductCustomOptions()));

            var settings = {
                async: true,
                cacheControl: "no-cache",
                data: form,
                method: "POST",
                mimeType: "multipart/form-data",
                url: oneClickUrl
            };

            var xhr = new XMLHttpRequest();
            xhr.open(settings.method, settings.url, settings.async);
            xhr.setRequestHeader('cache-control', settings.cacheControl);
            xhr.onload = function () {
                if (200 === xhr.status) {
                    var data = JSON.parse(xhr.responseText);
                    var isErrorsInForm = null;
                    // If not the preload of button run form validation to know if they are errors
                    if (!opts.preload) {
                        if (isProductAddtocartFormValidate) {
                            // @TODO: Add backend conf to change form name
                            isErrorsInForm = !isOystOneClickButtonFormValid('product_addtocart_form');
                        }

                        if ("function" === typeof isCustomProductAddtocartFormValid) {
                            // [Hook] This function allow anyone to use custom form validator, return as to be a boolean
                            isErrorsInForm = !isCustomProductAddtocartFormValid();
                        }

                        if (data.has_error && data.message) {
                            isErrorsInForm = true;
                            if ("function" === typeof customMessagesProductView) {
                                // This function allow anyone to display custom message
                                customMessagesProductView(data);
                            } else {
                                jQuery('<div id="messages_product_view"><ul class="messages"><li class="error-msg"><ul><li><span>' + data.message + '</span></li></ul></li></ul></div>').insertBefore(".product-view");
                            }
                        }
                    }
                    cb(isErrorsInForm, data.url);
                }
            };
            xhr.send(form);
        });
    };
}

/**
 * Wait for dom ready
 *
 * @param fn
 */
function ready(fn) {
    if (document.attachEvent ? 'complete' === document.readyState : 'loading' !== document.readyState) {
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

/**
 * Return the simple product id from a configurable product
 *
 * @returns {null}
 */
function getConfigurableProductChildId() {
    if ('undefined' === typeof(spConfig)) {
        return null;
    }

    var productCandidates = [];

    spConfig.settings.forEach(function (select, selectIndex) {
        var attributeId = select.id.replace('attribute', '');
        var selectedValue = select.options[select.selectedIndex].value;

        spConfig.config.attributes[attributeId].options.forEach(function (option, optionIndex) {
            if (option.id == selectedValue) {
                var optionProducts = option.products;

                if (0 == productCandidates.length) {
                    productCandidates = optionProducts;
                } else {
                    var productIntersection = [];
                    optionProducts.forEach(function (productId, productIndex) {
                        if (-1 < productCandidates.indexOf(productId)) {
                            productIntersection.push(productId);
                        }
                    });
                    productCandidates = productIntersection;
                }
            }
        });
    });

    return (1 == productCandidates.length) ? productCandidates[0] : null;
}

/**
 * Test if the form is valid
 *
 * return bool
 */
function isOystOneClickButtonFormValid(formName) {
    var form = new VarienForm(formName);

    return form.validator.validate();
}

/**
 * Move dom element as first child
 *
 * @param {HTMLElement} parentElement
 * @param {HTMLElement} newFirstChildElement
 */
function prependChild(parentElement, newFirstChildElement) {
    parentElement.insertBefore(newFirstChildElement, parentElement.firstChild);
}

/**
 * Move OneClick button in first position in add to cart buttons list
 */
function oneClickButtonPickToFirstAddToCartButtons() {
    ready(function () {
        var addToCartButtons = document.getElementsByClassName("add-to-cart-buttons")[0];
        var oystOneClickButton = document.getElementById("oyst-1click-button-wrapper");
        prependChild(addToCartButtons, oystOneClickButton);
    });
}

/**
 * Retrieve custom options value.
 *
 * @returns {Array}
 */
function configurableProductCustomOptions() {
    var customOptions = document.getElementsByClassName("product-custom-option"), inputType, name, optionId, value, options = [];

    for (var i = 0; i < customOptions.length; i++) {
        if (customOptions[i].hasAttribute("name")) {
            inputType = customOptions[i].getAttribute("type");
            name = customOptions[i].getAttribute("name");
            value = customOptions[i].value;
            optionId = name.replace(/\D/g,'');
            var customOption = {
                optionId: optionId,
                value: value
            };

            if (("checkbox" === inputType || "radio" === inputType) && customOptions[i].checked && value) {
                options.push(customOption);
            } else if ("checkbox" !== inputType && "radio" !== inputType && value) {
                if (hasClass(customOptions[i], "multiselect")) {
                    for (var j = 0; j < customOptions[i].length; j++) {
                        if (customOptions[i].options[j].selected) {
                            options.push({
                                optionId: optionId,
                                value: customOptions[i].options[j].value
                            });
                        }
                    }
                } else {
                    options.push(customOption);
                }
            }
        }
    }

    return options;
}

/**
 * Check if html element has specified class.
 *
 * @param element
 * @param cls
 *
 * @returns {boolean}
 */
function hasClass(element, cls) {
    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
}
