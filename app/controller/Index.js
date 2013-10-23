var isLogined = false;
var isLoadedApp = false;
var toolToGo = {};
Ext.define('smiley360.controller.Index', {
	extend: 'Ext.app.Controller',
	requires: ['smiley360.store.Members', 'smiley360.model.Member'],
	config: {
		id: 'ParentController',
		refs: {
			mainView: 'mainview',
			//newList   : '#newList',
			homeView: 'homeview',
			loginView: 'loginview',
			signupView: 'signupview',
			editProfileView: 'editprofileview',
			forgetPasswordView: 'forgetpasswordview',
			shareToFacebookView: 'sharetofacebookview',
			shareToTwitterView: 'sharetotwitterview',
			surveyView: 'surveyview',
			missionsView: 'missionsview',
			detailsView: 'detailsview',
			offersView: 'offersview',
			offerDetailsView: 'offerdetailsview',
			browseView: 'browseview',
			browseInstrumentsView: 'browseinstrumentsview',
			connectView: 'connectview',
			brandView: 'brandview',
			sidemenu: 'sidemenu'
		},
		control: {


			homeView: {
				onBrandTapCommand: 'onBrandTapCommand'
			},
			loginView: {
				AuthentificateCommand: 'AuthentificateCommand',
				ShowSignupViewCommand: 'ShowSignupViewCommand',
				ShowSurveyViewCommand: 'ShowSurveyViewCommand',
				setToolId: 'setToolId',
				tryLoginCommand: 'tryLoginCommand'

			},
			signupView: {
				// The commands fired by the signup view.
				signupCommand: 'signupCommand',
				AuthentificateCommand: 'AuthentificateCommand'
			},
			editProfileView: {
				onbtnSavechangesCommandProfile: 'onbtnSavechangesCommandProfile',
				getLocationCommand: 'getLocationCommand',
				getOffersCommand: 'getOffersCommand'
			},
			missionsView:
            {
            	showMissionDetailsCommand: 'showMissionDetailsCommand',
            },
			detailsView: {
				showMissionDetailsCommand: 'showMissionDetailsCommand',
				onShareConnectTapCommand: 'onShareConnectTapCommand',
				goSetSharingInfo: 'goSetSharingInfo',
				goAskPermissions: 'goAskPermissions',
				ReloadMissionSmiles: 'ReloadMissionSmiles',
				setToolId: 'setToolId',
			},
			offersView: {
				LoadOfferDetailsCommand: 'LoadOfferDetailsCommand',
				LoadOfferSurveyCommand: 'ShowSurveyViewCommand',
				showMissionDetailsCommand: 'showMissionDetailsCommand',
				LoadContactUsCommand: 'LoadContactUsCommand',
				acceptMissionCommand: 'acceptMissionCommand',
				declineMissionCommand: 'declineMissionCommand',
				getAddressCommand: 'getAddressCommand',
				setAddressCommand: 'setAddressCommand',
				verifyAddressCommand: 'verifyAddressCommand',
				getLocationCommand: 'getLocationCommand',
				getMissionListCommand: 'getMissionListCommand',
				getOffersCommand: 'getOffersCommand'
			},
			offerDetailsView: {
				showMissionDetailsCommand: 'showMissionDetailsCommand'
			},
			browseView: {
				onBrowseResultsByCategoryTapCommand: 'onBrowseResultsByCategoryTapCommand',
				onBrandTapCommand: 'onBrandTapCommand'
			},
			connectView: {
				onBrandTapCommand: 'onBrandTapCommand',
				onBrowseTapCommand: 'onBrowseTapCommand',
				onSearchTapCommand: 'onSearchTapCommand',
				onConnectTapCommand: 'onConnectTapCommand',
				onBrowseLoadCommand: 'onBrowseLoadCommand'
			},
			browseInstrumentsView: {
				onBrandTapCommand: 'onBrandTapCommand',
			},
			brandView: {
				goFollow: 'goFollow',
				goUnFollow: 'goUnFollow'
			},
			sidemenu:
			{
				updateDeviceId: 'updateDeviceId'
			}
		}
	},

	//	Base Class functions.
	init: function () {
		//================================
		console.log("Index -> initialized!");
		//================================
		this.callParent(arguments);
	},

	launch: function () {
		//================================
		console.log('Index -> launched!');
		//================================
		var me = this;
		saved_controller_obj = this;
		me.callParent(arguments);
		me.doJavascriptLoad('app/services/Configuration.js',
			function (response) {
				if (!response.success) { return }

				me.doJavascriptLoad('app/services/Services.js',
					function (response) {
						if (!response.success) { return }

						if (smiley360.configuration.isDebugMode()) {
							me.doJavascriptLoad('app/services/Services.mock.js',
								function (response) {
									if (!response.success) { return }
									alert('tryloadProfile');
									me.loadProfileDropdowns(function () {
										me.tryLoginUser();
									});
								});
						}
						else {
													
							try {								
								Ext.getStore('membersStore').load(function () {
									//alert('store onload alert');
									var membersStore = smiley360.services.getMemberStore();
									if( (tmp_params.guid == 'isSet')&& (membersStore.getCount() > 0) )								
								 		{
								 			tmp_params.guid = smiley360.services.getDeviceId();
								 			//alert('set from deviceid'+tmp_params.guid);
								 		};	
									me.loadProfileDropdowns(function () {
										if (tmp_params.facebookID != '') {
											//alert('find fbId'+tmp_params.facebookID);
											smiley360.services.loginToServer(tmp_params, function (fb_session) {
												//alert('doneLoginToserver');	
												//alert(JSON.stringify(tmp_params));	
												//alert(JSON.stringify(fb_session));										
												me.tryLoginUser();
											});
										}
											//alert('tmp_params.facebookID' + tmp_params.facebookID);
										else me.tryLoginUser();

									});
								});
							}
							catch (err) {
								Ext.Msg.alert('ERROR', 'Something is wrong! Please, login again!');
								me.loadProfileDropdowns(function () {
									me.tryLoginUser();

								});
							};

						}
					});
			});
	},

	// Tansitions
	slideLeftTransition: { type: 'slide', direction: 'left' },
	slideRightTransition: { type: 'slide', direction: 'right' },
	// Commands

	tryLoginCommand: function()
	{

	},

	onShareConnectTapCommand: function (view, memberID, brandName, brandID) {
		//alert('show review');
		Ext.getCmp('xReviewView').down('#xTitleLabel').setHtml('Add your review for ' + brandName);
		smiley360.brandData.BrandId = brandID;
		//alert(view == 'Share');
		//alert(view == 'Brand');
		smiley360.postReview = (view != 'Share');
	},

	getSpecialOffersCommand: function (view, memberID, brandID) {
		//var me = this;
		//console.log("onBrandTapCommand");
		//smiley360.services.getBrandDetails(memberID, brandID,
		//	function (response) {
		//		if (response.success) {
		//			smiley360.specialOffersBrands.push = response;
		//			//me.fireEvent('getSpecialOffersCommand', this, smiley360.memberData.UserId, smiley360.memberData.SpecialOffers[0].brandID);
		//			//Ext.Viewport.animateActiveItem(
		//			//	me.getBrandView(), me.slideLeftTransition);
		//		}
		//		else {
		//			console.log('BrandDetails is corrupted!');//show error on view
		//		}
		//	});
	},

	onBrandTapCommand: function (from, memberID, brandID, start, howmany) {
		var me = this;
		console.log("onBrandTapCommand");
		smiley360.services.getConnectBrand(memberID, brandID, start, howmany,
			function (response) {
				if (response.success) {
					smiley360.brandData = response;
					Ext.getCmp('xMainView').showExternalView('brandview');
				}
				else {
					console.log('BrandDetails is corrupted!');//show error on view
				}
			});
	},

	onConnectTapCommand: function () {
		console.log("onConnectTapCommand");
		var me = this;
		smiley360.services.getFeaturedBrands(
								function (response) {
									if (response.success) {
										delete response.success;
										smiley360.FeaturedBrands = response;
									}
								});
	},

	onBrowseLoadCommand: function () {
		console.log("onBrowseLoadCommand");

	},

	onBrowseResultsByCategoryTapCommand: function (from, category, subcategory, index, pageSize, cat_name, subcat_name) {
		console.log("onBrInstrTapCommand");
		var me = this;
		smiley360.services.getConnects_byCategory(category, subcategory, index, pageSize,
			function (response) {
				if (response.success) {
					smiley360.CategoryResults = response;
					smiley360.CategoryString = cat_name + ' / ' + subcat_name;
					Ext.getCmp('xMainView').showExternalView('browseinstrumentsview');
				}
				else {
					console.log('Categories is corrupted!');//show error on view
				}
			});
	},

	onSearchTapCommand: function (from, query, index, pageSize) {
		console.log("onSearchTapCommand");
		smiley360.SearchStr = '';
		var me = this;
		smiley360.services.getConnects_bySearch(query, index, pageSize,
			function (response) {
				//alert('Searched!');
				if (response.success) {
					smiley360.SearchStr = query;
					smiley360.SearchResults = response;
					Ext.getCmp('xMainView').showExternalView('browsesearchview');
				}
				else {
					console.log('Search is corrupted!');//show error on view
				}
			});
	},

	onBrowseTapCommand: function (from, memberID) {
		console.log("onBrowseTapCommand");
		var me = this;
		smiley360.services.getMyBrands(memberID,
			function (response) {
				if (response.success) {
					smiley360.memberData.UserBrands = response;
					delete response.success;
					smiley360.services.getHotBrands(
								function (response) {
									if (response.success) {
										delete response.success;
										smiley360.HotBrands = response;
										Ext.getCmp('xMainView').showExternalView('browseview');
									}
									else console.log('HotBrands is corrupted!');//show error on view

								});
				}
				else {
					console.log('UserBrandDetails is corrupted!');//show error on view
				}
			});

	},

	oneditLabelCommand: function () {
		console.log("oneditLabelCommand");
		Ext.Viewport.animateActiveItem(this.getEditProfileView(), this.slideLeftTransition);

	},

	declineMissionCommand: function (from, memberID, missionID) {
		var me = this;
		console.log('offer declined');
		smiley360.services.declineMission(memberID, missionID,
			function (response) {
				if (response.success) {
					//smiley360.missionData.MissionDetails = response;
					Ext.getCmp('xOfferView').fireEvent('getMissionListCommand', this, smiley360.memberData.UserId);
					Ext.getCmp('xOfferView').fireEvent('getOffersCommand', this, smiley360.memberData.UserId);
					smiley360.fromRemove = true;
					//Ext.getCmp('xMainView').showExternalView('offerdetailsview');
				}
				else {
					console.log('Offer is not declined!');//show error on view
				}
			});
	},
	getOffersCommand: function (from, memberID) {
		var me = this;
		smiley360.services.getOffers(memberID,
			function (response) {
				if (response.success) {
					delete response.success;
					smiley360.memberData.Offers = response;

					console.log('Offers updated successfully!');
					if (smiley360.fromRemove) {
						Ext.getCmp('xMainView').showExternalView('offersview');
						smiley360.fromRemove = false;
					};
				}
				else {
					console.log('Offers update error!');//show error on view
				}
			});
	},
	getMissionListCommand: function (from, memberID) {
		var me = this;
		smiley360.services.getMissionList(memberID,
			function (response) {
				if (response.success) {
					delete response.success;
					smiley360.memberData.MissionList = response;

					console.log('MissionList updated successfully!');
				}
				else {
					console.log('MissionList update error!');//show error on view
				}
			});
	},


	getAddressCommand: function (from, memberID) {
		var me = this;
		smiley360.services.getMemberAddress(memberID,
			function (response) {
				if (response.success) {
					delete response.success;
					//alert('i get add');
					for (var field in response) {
						//alert('before ' + smiley360.memberData.Profile[field]);
						//alert('ch to' + response[field]);
						smiley360.memberData.Profile[field] = response[field];
						//smiley360.memberData.Profile[field] = response[field];
						//alert('update ' + smiley360.memberData.Profile[field]);
					}


					console.log('Address is got successfully!');
				}
				else {
					console.log('Address load error!');//show error on view
				}
			});
	},

	setAddressCommand: function (from, memberID, addr1, addr2, city, stateID, zip, countryID) {
		var me = this;
		//alert('try set address');
		smiley360.services.setMemberAddress(memberID, addr1, addr2, city, stateID, zip, countryID,
			function (response) {
				if (response.success) {
					delete response.success;
					console.log('Address is set successfully!');
					//smiley360.missionData.MissionDetails = response;
					Ext.getCmp('xOfferView').fireEvent('getOffersCommand', this, smiley360.memberData.UserId);
					//Ext.getCmp('xMainView').showExternalView('offerdetailsview');
				}
				else {
					console.log('Address setting error!');//show error on view
				}
			});
	},

	verifyAddressCommand: function (from, memberID) {
		var me = this;
		smiley360.services.verifyMemberAddress(memberID,
			function (response) {
				if (response.success) {
					console.log('Address is verified successfully!');
					//smiley360.missionData.MissionDetails = response;
					smiley360.memberData.Profile.address_status = response.status;
					//Ext.getCmp('xMainView').showExternalView('offerdetailsview');
				}
				else {
					console.log('Address verification error!');//show error on view
				}
			});
	},

	acceptMissionCommand: function (from, memberID, missionID) {
		var me = this;
		console.log('offer accepted');
		smiley360.services.acceptMission(memberID, missionID,
			function (response) {
				if (response.success) {
					//smiley360.missionData.MissionDetails = response;
					Ext.getCmp('xOfferView').fireEvent('getMissionListCommand', this, smiley360.memberData.UserId);
					Ext.getCmp('xOfferView').fireEvent('getOffersCommand', this, smiley360.memberData.UserId);
					Ext.getCmp('xMainView').down('#xTabpanel').getTabBar().getComponent(2).enable();
					//Ext.getCmp('xMainView').showExternalView('offerdetailsview');
				}
				else {
					console.log('Offer is not accepted!');//show error on view
				}
			});
	},

	LoadContactUsCommand: function () {
		var me = this;
		smiley360.services.getContactUs(
			function (response) {
				if (response.success) {
					delete response.success;
					smiley360.ContactUs = response;

					Ext.widget('contactusview').show();
				}
				else {
					console.log('ContactUs is corrupted!');//show error on view
				}
			});
	},

	LoadOfferDetailsCommand: function (image, missionID, memberID) {
		var me = this;
		smiley360.services.getMissionDetails(missionID, memberID,
			function (response) {
				if (response.success) {
					smiley360.missionData.MissionDetails = response;

					Ext.getCmp('xMainView').showExternalView('offerdetailsview');
				}
				else {
					console.log('Offerdetails is corrupted!');//show error on view
				}
			});
	},

	LoadAllMissions: function (from, memberID) {
		var me = saved_controller_obj;
		me.missionsCounter = Object.keys(smiley360.memberData.MissionList).length;
		smiley360.AllMissionsList = [];

		for (var key in smiley360.memberData.MissionList) {
			var item = smiley360.memberData.MissionList[key];
			if (item)
				smiley360.services.getMissionDetails(item.missionID, memberID,
					function (response) {
						if (response.success) {
							delete response.success;

							smiley360.AllMissionsList.push(response);
						}
						else {
							console.log('Missiondetails is corrupted for mission' + item.missionID);//show error on view
						}

						if (--me.missionsCounter == 0) {
							Ext.getCmp('xDetailsView').setAllMissions();
						}

						console.log('Index -> [LoadAllMissions] left:', me.missionsCounter)
					});
		};
	},

	ReloadMissionSmiles: function (memberID, missionID) {
		smiley360.preventLoadIndicator = true;
		smiley360.services.getMissionDetails(missionID, memberID,
			function (response) {
				if (response.success) {
					delete response.success;
					Ext.getCmp('xDetailsView').updateMissionDetails(response, missionID);
					console.log('Missiondetails is updated for mission' + missionID);
					smiley360.preventLoadIndicator = false;
				}
				else {
					console.log('Missiondetails is corrupted for mission' + missionID);
					smiley360.preventLoadIndicator = false;
					//show error on view
				};
			});
	},

	showMissionDetailsCommand: function (image, missionID, isShare) {
		Ext.getCmp('xMainView').showExternalView('detailsview');
		Ext.getCmp('xDetailsView').setMissionDetails(missionID);
		if (isShare === true) {
			Ext.getCmp('xDetailsView').showSharePanel();
		}
		else if (isShare === false) {
			Ext.getCmp('xDetailsView').hideSharePanel();
		}
	},

	getLocationCommand: function (view, zip) {
		var me = this;
		console.log('Location is set');
		smiley360.services.getLocation(zip,
            function (response) {
            	if (response.success) {
            		if ((response.State != 0) && (response.City)) {
            			smiley360.memberData.Profile.city = response.City;
            			smiley360.memberData.Profile.stateID = response.State;
            			smiley360.memberData.Profile.zip = zip;
            			view.setAddress();
            		};
            		//Ext.getCmp('xMainView').showExternalView('offerdetailsview');
            	}
            	else {
            		console.log('Location cannot be setted!');//show error on view
            	}
            });
	},

	goContactUsCommand: function (view, memberID, name, email, category, comment) {
		var me = this;
		console.log('ContactUs comment is sent successfully!');
		smiley360.services.contactUs(memberID, name, email, category, comment,
            function (response) {
            	if (response.success) {
            		delete response.success;
            		smiley360.memberData.ContactData = response;
            		//Ext.getCmp('xMainView').showExternalView('offerdetailsview');
            	}
            	else {
            		console.log('ContactUs comment cannot be sent!');//show error on view
            	}
            });
	},
	goFollow: function (view, memberID, brandID) {
		var me = this;
		console.log('Followed successfully!');
		smiley360.services.follow(memberID, brandID,
            function (response) {
            	if (response.success) {
            		//delete response.success;
            		if (response.followSuccessful) {
            			Ext.getCmp('xBrandIsFollow').setText('FOLLOWING');
            			Ext.getCmp('xBrandIsFollow').setCls('has-shadow after-follow-btn');
            			smiley360.brandData.smileyConnect_isFollowed = true;
            		};
            		//smiley360.brandData.smileyConnect_isFollowed = response;
            		//Ext.getCmp('xMainView').showExternalView('offerdetailsview');
            	}
            	else {
            		console.log('Follow deprecated!');//show error on view
            	}
            });

	},
	goUnFollow: function (view, memberID, brandID) {
		var me = this;
		console.log('UnFollowed successfully!');
		smiley360.services.unfollow(memberID, brandID,
            function (response) {
            	if (response.success) {
            		//delete response.success;
            		if (response.unfollowSuccessful) {
            			Ext.getCmp('xBrandIsFollow').setText('FOLLOW');
            			Ext.getCmp('xBrandIsFollow').setCls('has-shadow follow-btn');
            			smiley360.brandData.smileyConnect_isFollowed = false;
            		};
            	}
            	else {
            		console.log('UnFollow deprecated!');//show error on view

            	}
            });

	},
	goAskPermissions: function (view, memberID) {
		var me = this;
		console.log('Checking permissions...');
		smiley360.services.checkfacebookpermissions(memberID,
            function (response) {
            	if (response.success && response.status == "success" && response.fb_scope != "null") {

            		if (response.fb_scope.indexOf('publish_stream') != -1)
            			smiley360.permissionsList.publish_stream = true

            		else smiley360.permissionsList.publish_stream = false;
            	}

            	else {
            		console.log('Permissions deprecated!');
            	}
            });
	},

	goSetSharingInfo: function (view, missionID, memberID, sharingTool_typeID, shareView) {
		var me = this;
		console.log('Setted seed phrase successfully!');
		smiley360.services.getMissionSharingToolDetails(missionID, memberID, sharingTool_typeID,
			function (response) {
				if (response.success) {
					//delete response.success;
					if (response) {
					    if (response[0].sharingTool_typeID == 2) {
					        var post_options = response[0].channelOptions;
					        var fb_check = Ext.getCmp('xToProfileCheckbox');
					        var bp_check = Ext.getCmp('xToBrandPageCheckbox');

					        if (fb_check && bp_check && response[0].channelOptions.length > 1)
					            for (var key in response[0].channelOptions) {
					                if (response[0].channelOptions[key] == 1)
					                    fb_check.show();
					                if (response[0].channelOptions[key] == 2)
					                    bp_check.show();
					            };
					    };

						if (response[0].link != null)
							if (shareView.setLink) {
								shareView.setLink(response[0].link);
							};
						if (response[0].seedphrase != null) {

							if (shareView != 'uploadphotoview') {
								if (shareView.down('#xCharacterMaximum')) {
									shareView.setCharacterMaximum(140 - response[0].seedphrase.length);
								}
							}
							else {
								Ext.getCmp('xViewPopup').config.saved_seedPhrase = response[0].seedphrase;
								Ext.getCmp('xViewPopup').config.saved_seedLength = 140 - response[0].seedphrase.length;
							}

							if (shareView.setSeedPhrase) {
								shareView.setSeedPhrase(response[0].seedphrase);
							};


						}

					};
				}
				else {
					console.log('Setted seed phrase deprecated!');//show error on view

				}
			});

	},

	AuthentificateCommand: function (view, login, password, viewId) {
		var me = this;
		//adding to localstorage;
		smiley360.services.authenticateservice(login, password, Ext.getStore('membersStore').getAt(0).data.deviceId,
			function (response) {
				isLogined = response.success;
				if (isLogined) {
					console.log('Index -> Login Successful!');

					me.updateMemberId(response.ID);
					me.loadMemberData(response.ID, function () {
						if (viewId == 'Signup') { smiley360.animateViewLeft('tutorialiew'); }
						else smiley360.animateViewLeft('mainview');
					});
				}
				else {
					console.log('Login unsuccessful!');
					Ext.Msg.alert('ERROR', 'Wrong login or password!<br>Try again!<br>');
					Ext.getCmp('login_btn').enable();//show error on view
				};
			});
	},

	ShowSignupViewCommand: function () {
		//================================
		console.log('ShowSignupViewCommand');
		//================================
		smiley360.animateViewLeft('signupview');
		//Ext.getCmp('xMainView').showExternalView('signupview');
		//Ext.Viewport.animateActiveItem(this.getSignupView(), this.slideLeftTransition);
	},

	onbtnSavechangesCommandProfile: function () {
		//================================
		console.log('SavechangesCommand');

		var fields = new Array(
			'fName',
			'lName',
			'email',
			'dob',
			'gender',
			'blogURL',
			'aboutself',
			'address1',
			'address2',
			'city',
			'stateID',
			'zip',
			'marital',
			'children',
			'howmanychildren',
			'income',
			'race');

		var profArray = {};

		for (var field in fields) {
			if (fields[field] == 'dob' || fields[field] == 'race') {
				console.log('Datebirthfield or Race')
			}
			else {
				profArray[fields[field]] = Ext.ComponentQuery.query('#' + fields[field])[0].getValue();
			}
			if (fields[field] == 'dob')
				profArray[fields[field]] = Ext.ComponentQuery.query('#' + 'birthdate')[0].getFormattedValue();

			if (fields[field] == 'race') {
				profArray[fields[field]] = '';

				var chbArray = Ext.ComponentQuery.query('#ddlCheckboxes checkboxfield');

				for (var chbItem in chbArray) {
					if (chbArray[chbItem].isChecked()) {
						var chbItemString = chbArray[chbItem].getId().toString();

						if (profArray[fields[field]] == '') {
							profArray[fields[field]] += chbItemString.substr(chbItemString.length - 1, chbItemString.length - 1);
						}
						else {
							profArray[fields[field]] += ',' + chbItemString.substr(chbItemString.length - 1, chbItemString.length - 1);
						}
					}
				}
				//alert(profArray[fields[field]]);
				if (!Ext.getCmp('ddlCheckboxes').isHidden()) {
					profArray['aboutself'] = smiley360.memberData.Profile.aboutself;
					profArray['blogURL'] = smiley360.memberData.Profile.blogURL;
				}
			}
		}

		smiley360.services.setProfile(smiley360.memberData.UserId, profArray,
			function (response) {
				if (response.success) {
					console.log('Your changes aplied successfully!');
					Ext.getCmp('xHomeView').setUser();
					Ext.getCmp('xEditProfile').fireEvent('getOffersCommand', this, smiley360.memberData.UserId);
				}
				else {
					console.log('Set Profile return error!');//show error on view
				}
			});


		Ext.getCmp('xMainView').showExternalView('homeview');
	},

	onShowOffersView: function (reloadData) {
		console.log("onShowOffersView -> reloadData:", reloadData === true);
		//if (smiley360.memberData.isProfileComplete.complete)
		if (reloadData === true) {
			var me = this;

			smiley360.services.getOffers(smiley360.memberData.UserId,
				function (response) {
					if (response.success) {
						delete response.success;
						smiley360.memberData.Offers = response;

						Ext.getCmp('xMainView').showExternalView('offersview');
					}
					else {
						console.log('getOffers is corrupted!');//show error on view
					}
				});
		}
		else {
			Ext.getCmp('xMainView').showExternalView('offersview');
		}

		//smiley360.services.getOffers(function (response) {
		//	if (response.success) {
		//		//alert('Get an offer: ' + response.userOffers[0].text);//provess/close view
		//		//Ext.getCmp('offers_label_text').setHtml(response.userOffers[0].text.toString());
		//	}
		//else {
		//	Ext.widget('missingoffersview').show();//alert('smth wrong');//show error on view
		//};
		//});
	},

	ShowSurveyViewCommand: function (fromView, missionID, link) {
		//=========================================================
		console.log('ShowSurveyViewCommand -> offerId: ', missionID);
		//=========================================================

		var surveyView = Ext.getCmp('xMainView').showExternalView('surveyview');
		var surveyFrame = Ext.get('xSurveyFrame');
		//var surveyFrameUrl = 'http://uat.smiley360.com/mobile_survey/pms000.php?deviceID='
		//   + Ext.getStore('membersStore').getAt(0).data.deviceId + '&offerID=' + missionID;
		//new to test
		var surveyFrameUrl = link + '?deviceID=' +
		Ext.getStore('membersStore').getAt(0).data.deviceId + '&offerID=' + missionID;

		surveyFrame.dom.src = surveyFrameUrl;

		Ext.Viewport.animateActiveItem(surveyView, this.slideLeftTransition);

	},

	signupCommand: function () {
		console.log("signupCommand");
		//Ext.Viewport.animateActiveItem(this.getHomeView(), this.slideLeftTransition);
		console.log('SignUpCommand');
		var me = this;
		var fields = new Array(
		   'first',
		   'last',
		   'username',
		   'password',
		   'email',
		   'zip',
		   'birthdate',
		   'gender',
		   'guid');

		var profArray = {};

		for (var field in fields) {
			if ((fields[field] != 'username') && (fields[field] != 'birthdate') && (fields[field] != 'guid'))
				profArray[fields[field]] = Ext.ComponentQuery.query('#' + fields[field] + '_signup')[0].getValue();
			if (fields[field] == 'birthdate') {
				profArray[fields[field]] = Ext.ComponentQuery.query('#' + fields[field] + '_signup')[0].getFormattedValue();
				//alert(profArray[fields[field]]);
			};
			if (fields[field] == 'username')
				profArray['username'] = Ext.ComponentQuery.query('#' + 'email' + '_signup')[0].getValue();
			if (fields[field] == 'guid')
				profArray['guid'] = Ext.getStore('membersStore').getAt(0).data.deviceId;
		}
		//alert(profArray.username);
		smiley360.services.signupMember(profArray.first,
										profArray.last,
										profArray.username,
										profArray.password,
										profArray.email,
										profArray.zip,
										profArray.birthdate,
										profArray.gender,
										profArray.guid,
			function (response) {
				if (response.success && (response.status == 'Signup successful.')) {
					Ext.Msg.alert('SUCCESS!', response.status);
					Ext.getCmp('Signup').fireEvent('AuthentificateCommand', this, profArray.email, profArray.password, 'Signup');
					console.log('Member signup is done successfully!');
				}
				else {
					if (response.success) Ext.Msg.alert('Hold up! There was a problem with <br>your sign up information.', '<br>' + response.status);
					console.log('Member signup returned an error!');
				}
			});

	},

	loadMemberData: function (memberId, success) {
		var me = saved_controller_obj;
		//alert('loadMemberData');
		smiley360.services.getMemberData(memberId,
			function (response) {
				if (response.success) {
					isLogined = true;
					smiley360.memberData = response;

					me.LoadAllMissions(me, memberId);

					if (success)
						success();
				}
				else {
					//TODO: show error message on view
					console.log('Index -> [getMemberData] return error!');
				}
			});
	},

	updateMemberId: function (memberID) {
		//alert('updateMemberId');
		var membersStore = smiley360.services.getMemberStore();
		if (membersStore.getCount() > 0) {

			var deviceId = smiley360.services.getDeviceId();
			membersStore.removeAll();
			membersStore.getProxy().clear();
			//membersStore.insert(membersStore.getAt(0), { memberId: memberId, deviceId: deviceId });
			membersStore.add({ memberId: memberID, deviceId: deviceId });


			console.log('Index -> updateMemberId: ' + smiley360.services.getMemberId());
		}
		membersStore.sync();
	},

	setToolId: function (toolId_toSet) {
		var toolsStore = Ext.getStore('toolsStore');
		toolsStore.removeAll();
		toolsStore.getProxy().clear();
		toolsStore.add({ toolId: toolId_toSet });

		//	console.log('Index -> setToolId: ' + toolsStore.getAt(0).data.toolId);

	},
	getToolId: function () {
		var toolsStore = Ext.getStore('toolsStore');

		if (toolsStore.getCount() > 0) {
			var toolId = toolsStore.getAt(0).data.toolId;
			toolToGo = toolId;
			console.log('Index -> getToolId: ' + toolId);
		}
		else console.log('Index -> getToolId: nodata');
		toolsStore.removeAll();
		toolsStore.getProxy().clear();
		return toolToGo;
	},

	doJavascriptLoad: function (jsPath, callback) {
		var onload = function () {
			console.log('Index -> [' + jsPath + '] loading done!');

			callback({ success: true });
		}

		var onerror = function () {
			console.log('Index -> [' + jsPath + '] loading error!');

			callback({ success: false });
		}

		Ext.Loader.injectScriptElement(jsPath, onload, onerror, this);
	},

	loadProfileDropdowns: function (success) {
		smiley360.services.getProfileDropdowns(
			function (response) {
				if (response.success) {
					smiley360.ProfileDropdowns = response;
					console.log('Index -> [loadProfileDropdowns] completed!');

					if (success) {
						success();
					}
				}
				else {
					console.log('Index -> [loadProfileDropdowns] corrupted!');
				}
			});
	},

	generateDeviceId: function () {
		var tmp = this;
		var membersStore = Ext.getStore('membersStore');
		if (membersStore.getCount() == 0)
			//membersStore.removeAll();
		{
			membersStore.add({ deviceId: tmp.guid() });
			membersStore.sync();
		}

		console.log('Index -> generateDeviceId: ' + membersStore.getAt(0).data.deviceId);
	},

	updateDeviceId: function () {
		var tmp = this;
		var membersStore = Ext.getStore('membersStore');
		if (membersStore.getCount() == 0)
			//membersStore.removeAll();
		{
			membersStore.add({ deviceId: tmp_params.guid });
			membersStore.sync();
		}

		alert('Index -> updateDeviceId: ' + membersStore.getAt(0).data.deviceId);
	},


	guid: function () {
		return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4() + this.s4() + this.s4();

	},

	s4: function () {
		return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
	},

	updateDeviceId: function () {
		var membersStore = smiley360.services.getMemberStore();
		if (membersStore.getCount() > 0) {
			function recover_guid() {
				return guid_s4() + guid_s4() + '-' + guid_s4() + '-' + guid_s4() + '-' + guid_s4() + '-' + guid_s4() + guid_s4() + guid_s4();

			}
			function guid_s4() {
				return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
			}
			var deviceID = recover_guid();
			membersStore.removeAll();
			membersStore.getProxy().clear();
			membersStore.add({ deviceId: deviceID });
		};
		membersStore.sync();


		console.log('Index -> updateDeviceId: ' + smiley360.services.getDeviceId());
	},
	tryLoginUser: function () {
		//alert('Start try login user');
		var me = saved_controller_obj;//Ext.app.getController('ParentController');

		var membersStore = smiley360.services.getMemberStore();//Ext.getStore('membersStore');
		//alert(Ext.getStore('membersStore').getAt(0).data.memberId + '_' + Ext.getStore('membersStore').getAt(0).data.deviceId);
		if (membersStore.getCount() > 0) {
			var memberId = smiley360.services.getMemberId();//membersStore.getAt(0).data.memberId;
			var deviceId = smiley360.services.getDeviceId();//membersStore.getAt(0).data.deviceId;
			//if (tmp_params.guid!='')
			//		deviceId = tmp_params.guid;
				tmp_params.guid = '';
				tmp_params.facebookID = '';
				tmp_params.token = '';
			if (memberId) {
				console.log('Index -> [tryLoginUser] with stored memberId:' + memberId);

				me.loadMemberData(memberId, function () {
					smiley360.animateViewLeft('mainview');
					smiley360.destroySplash();
					isLoadedApp = true;
					var cmp_tool = me.getToolId();
					if (cmp_tool == 'sharetofacebookview') {
						Ext.getCmp('xMainView').showExternalView('detailsview');
						Ext.getCmp('xMainView').down('#xTabpanel').down('#xDetailsView').showSharePanel();

						//Ext.widget('sharetofacebookview').show();
					};

					if (cmp_tool == 'sharetotwitterview') {
						Ext.getCmp('xMainView').showExternalView('detailsview');
						Ext.getCmp('xMainView').down('#xTabpanel').down('#xDetailsView').showSharePanel();

						//Ext.widget('sharetotwitterview').show();
					};
					if (cmp_tool == 'uploadphotoview') {
						Ext.getCmp('xMainView').showExternalView('detailsview');
						Ext.getCmp('xMainView').down('#xTabpanel').down('#xDetailsView').showSharePanel();

						//Ext.widget('sharetotwitterview').show();
					};
				});

				return;
			}
			else if (deviceId ) {
				var me = this;				
				console.log('Index -> [tryLoginUser] with cached deviceId:' + deviceId);

				smiley360.services.getMemberIdByDeviceId(deviceId,
					function (response) {
						if (response.success) {
							console.log('Index -> [tryLoginUser] with received memberId:' + response.ID);

							me.updateMemberId(response.ID);
							me.loadMemberData(response.ID, function () {
								smiley360.animateViewLeft('mainview');
								smiley360.destroySplash();
								isLoadedApp = true;
								var cmp_tool = me.getToolId();
								if (cmp_tool == 'sharetofacebookview') {
									Ext.getCmp('xMainView').showExternalView('detailsview');
									Ext.getCmp('xMainView').down('#xTabpanel').down('#xDetailsView').showSharePanel();
								};

								if (cmp_tool == 'sharetotwitterview') {
									Ext.getCmp('xMainView').showExternalView('detailsview');
									Ext.getCmp('xMainView').down('#xTabpanel').down('#xDetailsView').showSharePanel();
								};
								if (cmp_tool == 'uploadphotoview') {
									Ext.getCmp('xMainView').showExternalView('detailsview');
									Ext.getCmp('xMainView').down('#xTabpanel').down('#xDetailsView').showSharePanel();

								};
							});
						}
						else {
							console.log('Index -> [tryLoginUser] don\'t received memberId for deviceId:' + deviceId);
							var cmp_tool = me.getToolId();
							if (response.memberID == 0) {
								if (cmp_tool == 'login') {
									Ext.Msg.alert('ERROR', 'Oops something went wrong!' +
										'<br>The email address on your Facebook account may already be in use, or Facebook may be blocking the operation. Please contact us for details!');
									me.updateDeviceId();
								}
								else
									me.updateDeviceId();
							};
							smiley360.animateViewLeft('loginview');
							smiley360.destroySplash();
							isLoadedApp = true;
						}
					});

				return;
			}
		}

		// if no data stored generate device id and show login view
		//if(tmp_params.guid == '')
		this.generateDeviceId();

		smiley360.animateViewLeft('loginview');
		smiley360.destroySplash();
		isLoadedApp = true;
	},

	missionsCounter: 0,
});

/* Global models and methods */

smiley360.memberData = {};
smiley360.missionData = {};
smiley360.brandData = {};
smiley360.SearchStr = {};
smiley360.CategoryString = {};
smiley360.AllMissionsList = [];
smiley360.slideShowImages = {};
smiley360.postReview = {};
smiley360.fromRemove = false;
smiley360.preventLoadIndicator = false;
smiley360.failedShares = [];


//changeuserProfileImage
smiley360.userProfileImage = 'http://uat.smiley360.com/images/default-profile.jpg';

smiley360.permissionsList =
{
	///login with fb
	offline_access: false,
	email: false,
	read_stream: false,
	///sharing permission
	publish_stream: false

};

smiley360.viewStatus =
{
	initial: 'initial',
	progress: 'progress',
	successful: 'successful',
	unsuccessful: 'unsuccessful',
};

smiley360.defaultViewStates =
{
	initial: 'POST',
	progress: 'POSTING...',
	successful: 'POST SUCCESSFUL',
	unsuccessful: 'POST UNSUCCESSFUL',
};

smiley360.sharingType =
{
	facebook: '2',
	twitter: '3',
	shareLink: '4',
	face2face: '5',
	smileyConnect: '6',
	uploadPhoto: '9',
	blog: '10',
	youtube: '11',
	pinterest: '12',
};

smiley360.setResponseStatus = function (view, response, states, updateSmileBtn, missionUpdID) {
	var status = (response.success || response.status == 'success') ?
        smiley360.viewStatus.successful :
        smiley360.viewStatus.unsuccessful;
	if (!response.success || response.status == 'failed') {
		status = smiley360.viewStatus.unsuccessful;
	};


	if (updateSmileBtn && response.points) {
		updateSmileBtn.setSmilesDone(response.points);
	};
	if (missionUpdID) {
		Ext.getCmp('xDetailsView').fireEvent('ReloadMissionSmiles', smiley360.memberData.UserId, missionUpdID);
	};
	smiley360.setViewStatus(view, status, states);
}

smiley360.setViewStatus = function (view, status, states) {
	if (states) {
		states.initial = states.initial || smiley360.defaultViewStates.initial;
		states.progress = states.progress || smiley360.defaultViewStates.progress;
		states.successful = states.successful || smiley360.defaultViewStates.successful;
		states.unsuccessful = states.unsuccessful || smiley360.defaultViewStates.unsuccessful;
	}
	else
		states = smiley360.defaultViewStates;

	var viewName = Ext.getDisplayName(view);
	var logMessage = Ext.String.format(
        'Global -> setViewStatus: { view: {0}, status: {1} }', viewName, status);

	console.log(logMessage);

	var xShareButton = view.down('#xShareButton');
	var xStatusIndicator = view.down('#xStatusIndicator');
	if (xStatusIndicator) {
		var statusAnimation = {
			element: xStatusIndicator.element,
			easing: 'ease-out',
			duration: 2000,
			preserveEndState: true,
			from: { width: 0 },
			to: { width: view.getWidth() },
		};
	}

	if (view != Ext.getCmp('xForgetPasswordView')) {
		switch (status) {
			case smiley360.viewStatus.progress: {
				xShareButton.disable();
				xShareButton.setText(states.progress);

				if (xShareButton.getIcon()) {
					xShareButton.setIcon('resources/images/share-initial.png');
				}

				xStatusIndicator.setStyle('background-color: #F9A419;');

				statusAnimation.onEnd = function () {
					if (xShareButton.getText() == 'POSTING...') {
						Ext.Animator.run(statusAnimation);
					}
				};

				break;
			}
			case smiley360.viewStatus.successful: {
				xShareButton.setText(states.successful);

				if (xShareButton.getIcon()) {
					xShareButton.setIcon('resources/images/share-successful.png');
				}

				xStatusIndicator.setStyle('background-color: #5F9E45;');

				statusAnimation.duration = 100;
				statusAnimation.easing = 'ease-in',
				statusAnimation.from = { width: xStatusIndicator.getWidth() };

				var task = new Ext.util.DelayedTask(function () {

					xShareButton.setText(states.initial);
					xShareButton.enable();

					if (xShareButton.getIcon()) {
						xShareButton.setIcon('resources/images/share-initial.png');
					}

					xStatusIndicator.setStyle('background-color: #E2DDDA;');
				});

				task.delay(5000);

				break;
			}
			case smiley360.viewStatus.unsuccessful: {
				xShareButton.setText(states.unsuccessful);

				if (xShareButton.getIcon()) {
					xShareButton.setIcon('resources/images/share-unsuccessful.png');
				}

				xStatusIndicator.setStyle('background-color: #ED1C24;');

				statusAnimation.duration = 100;
				statusAnimation.easing = 'ease-in',
				statusAnimation.from = { width: xStatusIndicator.getWidth() };

				var task = new Ext.util.DelayedTask(function () {
					xShareButton.setText(states.initial);
					xShareButton.enable();
					if ((viewName == 'smiley360.view.ShareToFacebook')
						|| (viewName == 'smiley360.view.ShareToTwitter')) {

						var shareView = Ext.widget('connectpopupview').show();
						if (shareView.setToolName)
							if (viewName == 'smiley360.view.ShareToFacebook')
								shareView.setToolName('Facebook')
							else shareView.setToolName('Twitter');
					}
					if (viewName == 'smiley360.view.UploadPhoto') {

						var shareView = Ext.widget('connectpopupview').show();
						if (shareView.setToolName)
							if (smiley360.failedShares.length == 2) {
								if ((smiley360.failedShares[0] == 'fb_f' && smiley360.failedShares[1] == 'twi_f')
									||
									(smiley360.failedShares[1] == 'fb_f' && smiley360.failedShares[0] == 'twi_f')) {
									shareView.setToolName('Facebook and Twitter');
								}
								else {
									if (smiley360.failedShares[0] == 'fb_f' || smiley360.failedShares[1] == 'fb_f')
										shareView.setToolName('Facebook');
									if (smiley360.failedShares[0] == 'twi_f' || smiley360.failedShares[1] == 'twi_f')
										shareView.setToolName('Twitter');
								}
							}
						smiley360.failedShares = [];
					}


					if (xShareButton.getIcon()) {
						xShareButton.setIcon('resources/images/share-initial.png');
					}

					xStatusIndicator.setStyle('background-color: #E2DDDA;');
				});

				task.delay(5000);

				break;
			}
			default:
		}

		Ext.Animator.run(statusAnimation);
	}
	else {
		Ext.getCmp('xForgetPasswordView').setStatus(status);
	};
}

smiley360.adjustPopupSize = function (view, extraSize) {

	var contentHeight = view.down('#xRootPanel').element.getHeight() + (extraSize | 0);
	var containerHeight = Ext.Viewport.element.getHeight() * 0.9;

	if (containerHeight > contentHeight) {
		view.setHeight(contentHeight);
	}
	else {
		view.setHeight(containerHeight);
	}
}

smiley360.animateViewLeft = function (viewAlias) {
	var view = smiley360.getOrCreateView(viewAlias);

	console.log('Global -> opened [' + viewAlias + ']');

	Ext.Viewport.animateActiveItem(view, { type: 'slide', direction: 'left' }).show();
}

smiley360.getOrCreateView = function (viewAlias) {
	var view = Ext.Viewport.down(viewAlias);
	//create the form if it doesn't exists
	if (view == null) {
		view = Ext.Viewport.add({ xtype: viewAlias });

		console.log('Global -> created [' + viewAlias + ']');
	}

	return view;
}

smiley360.destroySplash = function () {
	// Destroy the #appLoadingIndicator element
	var appLoadingIndicator = Ext.fly('appLoadingIndicator');
	if (appLoadingIndicator) {
		appLoadingIndicator.destroy();

		console.log('Index -> [appLoadingIndicator] destroyed!');
	}
	else {
		console.log('Index -> [appLoadingIndicator] is NULL!');
	}
}

