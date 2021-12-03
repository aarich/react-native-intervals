app_release = 3-0
my_release_num = 9
release_channel = prod-$(app_release)

git-status:
	@status=$$(git status --porcelain); \
	if [ ! -z "$${status}" ]; \
	then \
		echo "Error - working directory is dirty."; \
		exit 1; \
	fi

build-web:
	cp ./web/index.php ./web/index.html
	cp ./assets/images/icon.png ./web/banner.png
	expo build:web
	mv ./web-build/index.html ./web-build/index.php
	rm ./web/index.html
	rm ./web/banner.png
	bash scripts/copyFiles.sh

build-prep: git-status
	@echo "***************************"
	@echo " App Version Number: $(app_release)"
	@echo " My Version Number: $(my_release_num)"
	@echo " Release Channel: $(release_channel)"
	@echo "***************************"
	@echo

	@echo "Updating app.json"
	cp app.json app.json.bak
	node scripts/updateConfig.js $(my_release_num) $(app_release)

build-finish:
	@echo "Resetting app.json"
	node scripts/resetConfig.js


build-ios: build-prep
	expo build:ios -t archive --release-channel $(release_channel) --apple-id arich@hmc.edu
	build-finish

publish:
	expo publish --release-channel $(release_channel)