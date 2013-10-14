var hide_panel, first_time, dock_panel;
Ext.define('smiley360.view.Brand', {
    extend: 'Ext.Panel',
    alias: 'widget.brandview',
    requires: [
        'Ext.TitleBar',
        'Ext.Rating'
    ],
    config: {
        id: 'xBrandView',
        title: 'Brand',
        items: [{
            xtype: 'spacer',
            height: '14px',
            style: 'background-color: #f4f3f1; margin: 0px 2px; -webkit-border-radius: 5px 5px 0px 0px;'
        }, {
            xtype: 'spacer',
            height: '7px',
            style: 'background-color: #efecea;'
        }, {
            xtype: 'container',
            layout: 'hbox',
            style: 'box-shadow: 0px 1px 2px rgba(0,0,0,0.5); background-color: rgb(239, 236, 234);',
            items: [{
                xtype: 'container',
                style: 'padding: 5px 5px 5px 20px;',
                layout: { type: 'vbox', },
                width: '50%',
                //height: '100%',
                items: [{
                    xtype: 'label',
                    id: 'xBrandTitle',
                    html: 'FENDER',
                    style: 'line-height: 125%; font-size:1.4em; font-family: \'franklin\';',
                }, {
                    xtype: 'label',
                    id: 'xBrandDescription',
                    html: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore.Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore.Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore.Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore.',
                    style: 'line-height: 125%; font-size:1em; font-family: \'franklin\'; text-align: left; word-break: break-word; word-wrap: break-word;',
                }, {
                    xtype: 'container',
                    layout: 'hbox',
                    hidden: true,
                    id: 'Top10Container',
                    style: 'padding-left: 15px;',
                    items: [
                    //	{
                    //	xtype: 'image',
                    //	width: 50,
                    //	height: 50,
                    //	style: 'border-radius:0px; margin-left:-4px;',
                    //	src: 'resources/images/brands_1.png',
                    //	listeners: {
                    //		tap: function () {
                    //			Ext.widget('brandimageview').show();
                    //		}
                    //	},
                    //},//1
                    ]
                }],
            }, {
                xtype: 'container',
                layout: { type: 'vbox', },
                style: 'padding: 5px 20px 5px 5px;',
                width: '50%',
                //height: '100%',
                items: [{
                    xtype: 'image',
                    id: 'xBrandImage',
                    cls: 'has-shadow browse-pict',
                    src: 'resources/images/fender.png',
                    style: 'background-color: white; border-color: white; border-style: solid; border-width: 1px; border-radius: 5px; margin-top: -20px;',
                    height: 120,
                }, {
                    xtype: 'rating',
                    id: 'xBrandRating',
                    labelWidth: 'auto',
                    itemsCount: 5,
                    readOnly: true,
                    style: 'margin: 5px -10px 5px 0px;',
                    itemCls: 'x-rating-star',
                    itemHoverCls: 'x-rating-star-hover',
                    disabled: true
                }, {
                    xtype: 'button',
                    cls: 'has-shadow follow-btn',
                    id: 'xBrandIsFollow',
                    style: 'font-family: franklin; font-size: 0.8em; margin: 5px; border: 0;',
                    height: 30,
                    text: 'FOLLOW',
                    listeners: {
                        tap: function () {
                            if (this.getCls() == 'has-shadow follow-btn') {
                                Ext.getCmp('xBrandView').fireEvent('goFollow', this, smiley360.memberData.UserId, smiley360.brandData.BrandId);
                                //this.setText('FOLLOWING');
                            }
                            else {

                                Ext.getCmp('xBrandView').fireEvent('goUnFollow', this, smiley360.memberData.UserId, smiley360.brandData.BrandId);
                                //this.setText('FOLLOW');
                            }
                        }
                    }
                }, {
                    xtype: 'button',
                    cls: 'has-shadow add-review-btn',
                    style: 'font-family: franklin; font-size: 0.8em; margin: 5px; border: 0;',
                    height: 30,
                    text: 'ADD REVIEW',
                    listeners: {
                        tap: function () {
                            Ext.widget('reviewforfenderview').show();
                            Ext.getCmp('xDetailsView').fireEvent('onShareConnectTapCommand', 'Brand', smiley360.memberData.UserId, smiley360.brandData.BrandDetails.smileyConnect_title, smiley360.brandData.BrandId);
                        }
                    }
                }],
            }]
        }, {
            xtype: 'spacer',
            height: '14px',
            style: 'background-color: #efecea; margin: 0px 2px;',
        }, {
            xtype: 'spacer',
            height: '7px',
            style: 'background-color: #efecea;'
        }, {
            xtype: 'container',
            cls: 'has-shadow',
            layout: 'hbox',
            items: [{
                xtype: 'label',
                html: 'REVIEWS',
                cls: 'heading-text active-sign',
                style: 'padding-left: 15px; width: 100%;',
            }]
        }, {
            xtype: 'container',
            layout: 'vbox',
            id: 'xAllCommentsContainer'
        }, {
            xtype: 'spacer',
            height: '7px',
            style: 'background-color: #efecea;',
            cls: 'has-shadow',
        }, {
            xtype: 'spacer',
            height: '7px',
            style: 'background-color: #f4f3f1; margin: 0px 2px;'
        }, {
            xtype: 'container',
            laytout: { type: 'vbox' },
            cls: 'has-shadow',
            items: [{
                xtype: 'spacer',
                height: '7px',
                style: 'background-color: #f4f3f1; margin: 0px 2px; -webkit-border-radius: 0px 0px 5px 5px;'
            }, {
                xtype: 'spacer',
                height: '10px',
                style: 'background: transparent;'
            }],
        }],
        listeners: {
            show: function () {
                console.log('Brand view showed!');
                this.setBrandDetails();
                this.setBrandComments();
            },
            initialize: function () {

            },
        },
    },
    setBrandDetails: function () {
        var BrDetails = smiley360.brandData.BrandDetails;

        if (BrDetails.smileyConnect_title)
            Ext.getCmp('xBrandTitle').setHtml(BrDetails.smileyConnect_title);
        if (BrDetails.smileyConnect_description)
            Ext.getCmp('xBrandDescription').setHtml(BrDetails.smileyConnect_description);
        if (BrDetails.smileyConnect_detailsImage_URL)
            var str = smiley360.configuration.getResourceDomain() + '/' + BrDetails.smileyConnect_detailsImage_URL;

        Ext.getCmp('xBrandImage').setSrc(str);

        if (BrDetails.smileyConnect_rating) {
            Ext.getCmp('xBrandRating').setValue(BrDetails.smileyConnect_rating - 1);
        }

        if (BrDetails.smileyConnect_isFollowed) {
            Ext.getCmp('xBrandIsFollow').setCls('has-shadow after-follow-btn');
            Ext.getCmp('xBrandIsFollow').setText('FOLLOWING');
        }
        else {
            Ext.getCmp('xBrandIsFollow').setCls('has-shadow follow-btn');
            Ext.getCmp('xBrandIsFollow').setText('FOLLOW');
        };
        Ext.getCmp('xBrandView').setTop10();
    },

    setTop10: function () {
        var brandTopImages = smiley360.brandData.BrandDetails.smileyConnect_topTenCommentImages;
        //xt.getCmp('xBrandImageCarousel').removeAll(true, true);
        //another removal
        //console.log(brandTopImages.valueOf());
        for (var item in brandTopImages) {
            //alert('add thumb' + brandTopImages[item].sc_commentID);
            Ext.getCmp('Top10Container').add(new Ext.Img(
                {
                    width: 50,
                    height: 50,
                    id: 'Top10_' + brandTopImages[item].sc_commentID,
                    style: 'border-radius:0px; margin-left:-4px;',
                    src: smiley360.configuration.getResourceDomain() + '/' + brandTopImages[item].thumbnailImage_URL,
                    listeners: {
                        tap: function () {
                            //Ext.getCmp('xBrandView').setItem(brandTopImages[item].sc_commentID);
                            smiley360.slideShowImages = brandTopImages[item].sc_commentID;
                            Ext.widget('brandimageview').show();
                            //Ext.getCmp('xBrandImageCarousel').setActiveItem(Ext.getCmp('xBrandImage_Pict' + brandTopImages[item].sc_commentID));
                        },
                    },
                }));
        };
    },

    setBrandComments: function () {
        Ext.getCmp('xAllCommentsContainer').removeAll(true, true);
        var BrComments = smiley360.brandData.BrandComments;
        for (var key in BrComments) {
            var oneItem = BrComments[key];
            this.setCommentItem(oneItem);
        };


    },
    setCommentItem: function (oneItem) {
    	var oneItemContainer = new Ext.Container({
    		//id: id + 'container',
    		layout: { type: 'hbox' },
    		cls: 'brands-brand-panel',
    	});

    	var domContainer = oneItemContainer.element.dom.firstChild;
    	
    		var imgTag = document.createElement("img");
    		imgTag.style.minWidth = '100px';
    		imgTag.style.marginRight = '15px';
    		imgTag.style.marginBottom = '5px';
    		imgTag.style.borderRadius = '5px';
    		imgTag.style.borderStyle = 'solid';
    		imgTag.style.borderColor = 'white';
    		imgTag.style.backgroundColor = 'white';
    		imgTag.style.float = 'left';
    		imgTag.setAttribute('id', 'xBrandPageImage_' + oneItem.sc_brandID);
    		if (oneItem.member_image_file_name) {
    			imgTag.setAttribute('src', smiley360.configuration.getProfilePic(oneItem.memberID, oneItem.member_image_file_name));
    		}
    		else {
    			imgTag.setAttribute('src', smiley360.configuration.getResourceDomain() + '/images/default-profile.jpg');
    		};
    		imgTag.setAttribute('class', 'has-shadow');

    		domContainer.appendChild(imgTag);
    	
        //********************************************************************

        if (oneItem.has_image == 1 &&
            oneItem.thumbnailImage_URL) {

            var imgRightTag = document.createElement("img");
            imgRightTag.style.minWidth = '50px';
            imgRightTag.style.marginLeft = '15px';
            imgRightTag.style.marginTop = '5px';
            imgRightTag.style.borderRadius = '5px';
            imgRightTag.style.borderStyle = 'solid';
            imgRightTag.style.borderColor = 'white';
            imgRightTag.style.backgroundColor = 'white';
            imgRightTag.style.float = 'right';
            imgRightTag.setAttribute('id', 'comment_img_' + oneItem.sc_commentID);
            imgRightTag.setAttribute('src', smiley360.configuration.getResourceDomain() + '/' + oneItem.thumbnailImage_URL);
            imgRightTag.setAttribute('class', 'has-shadow');
            imgRightTag.addEventListener('click', function (e) {
                console.log('stopping event', e);
                e.preventDefault();
                Ext.widget('brandimageview').show();
            });

            domContainer.appendChild(imgRightTag);
            //********************************************************************
        }

        var userNameTag = document.createElement("p");
        userNameTag.style.margin = '0px 15px 5px 0px';
        userNameTag.style.display = 'inline-block';
        userNameTag.style.fontSize = '1.1em';
        userNameTag.style.fontFamily = 'franklin';
        userNameTag.style.fontWeight = 'bold';
        //userNameTag.style.color = '#413f40';
        userNameTag.innerText = oneItem.member_user_name;
        userNameTag.setAttribute('class', 'set-height');

        domContainer.appendChild(userNameTag);
        //********************************************************************

        var datetimeTag = document.createElement("p");
        datetimeTag.style.margin = '0px 0px 5px 0px';
        datetimeTag.style.display = 'inline-block';
        datetimeTag.style.fontSize = '0.8em';
        datetimeTag.style.fontFamily = 'franklin';
        datetimeTag.style.color = '#7c7a7b';
        datetimeTag.innerText = oneItem.sc_comment_date_created;
        datetimeTag.setAttribute('class', 'set-height');

        domContainer.appendChild(datetimeTag);
        //********************************************************************

        var commentTag = document.createElement("p");
        commentTag.style.fontSize = '1em';
        commentTag.style.fontFamily = 'franklin';
        commentTag.style.wordWrap = 'break-word';
        commentTag.style.wordBreak = 'break-word';
        commentTag.style.textAlign = 'justify';
        commentTag.innerText = oneItem.sc_comment_text;
        commentTag.setAttribute('class', 'set-height');

        domContainer.appendChild(commentTag);
        //********************************************************************

        if (oneItem.commenter_isonMission == 1) {
            LabelItem = oneItemContainer.add(new Ext.Label(
            {
                cls: 'rew_comment',
                style: 'font-size:0.8em; margin-top: 0px; padding: 0px 15px 10px 0px; word-wrap: break-all; background-color: #efecea;font-family: \'franklin\';',
                html: 'I\'m on the mission!',
            }));
        }

        var commentsContainer = Ext.getCmp('xAllCommentsContainer');
        if (commentsContainer) {
            var itemsSpacer = commentsContainer.add(new Ext.Spacer(
            {
                height: '2px',
                style: 'background-color: #efecea; border-bottom: 1px dashed #D7CFCD;'
            }));

            commentsContainer.add(oneItemContainer);
        }
    },
    onBackButtonTap: function () {
        console.log('back button tapped');
        this.fireEvent('backButtonCommandOffers', this);
    },
    onGoToProfileTap: function () {
        console.log('GoToProfile button tapped');
        this.fireEvent('GoToProfileCommand', this);
    },
    oneditLabel: function () {
        console.log("oneditLabel");
        this.fireEvent('oneditLabelCommand', this);
    },
});
