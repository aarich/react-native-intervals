RELEASE_NUM = 4-0
CHANNEL = prod-$(RELEASE_NUM)
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
	cp app.json app.json.bak
	node scripts/updateConfig.js $(RELEASE_NUM) $(DEST)

build-finish:
	@echo "Resetting app.json"
	node scripts/resetConfig.js

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
	$(MAKE) build-finish

build-ios:
	$(MAKE) build-prep DEST=IOS
	# eas build -p ios --profile production --auto-submit --non-interactive --no-wait
	eas build -p ios --profile production --auto-submit --no-wait
	$(MAKE) build-finish

build-android:
	# $(MAKE) build-prep DEST=ANDROID
	# eas build -p android --profile production --auto-submit --non-interactive --no-wait
	eas build -p android --profile production --auto-submit --no-wait
	$(MAKE) build-finish

publish: build-prep
	expo publish --release-channel $(CHANNEL)
	$(MAKE) build-finish