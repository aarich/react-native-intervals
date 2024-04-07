RELEASE_NUM = 5-0-0
DEST = NONE

git-status:
	@status=$$(git status --porcelain); \
	if [ ! -z "$${status}" ]; \
	then \
		echo "Error - working directory is dirty."; \
		exit 1; \
	fi

build-prep:
	@echo "***************************"
	@echo " App Version Number: $(RELEASE_NUM)"
	@echo " Release Channel: $(CHANNEL)"
	@echo "***************************"
	@echo

	@echo "Updating app.json"
	node scripts/updateConfig.js $(RELEASE_NUM) $(DEST)

build-web:
	$(MAKE) build-prep DEST=WEB
	cp ./web/index.php ./web/index.html
	cp ./assets/images/icon.png ./web/banner.png
	-expo build:web
	mv ./web-build/index.html ./web-build/index.php
	rm ./web/index.html
	rm ./web/banner.png
	@osascript -e 'display notification "Enter password to copy files" with title "Password Required"'
	-bash scripts/copyFiles.sh

build-ios:
	$(MAKE) build-prep DEST=IOS
	eas build -p ios --profile production --auto-submit --no-wait

build-android:
	# $(MAKE) build-prep DEST=ANDROID
	eas build -p android --profile production --auto-submit --no-wait

publish-dev: build-prep
	eas update --channel development

publish-prod: build-prep
	eas update --channel production
