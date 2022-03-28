BUILD_DIR := docs/
BUILD_DOC_DIR := ${BUILD_DIR}doc/
DOC_FILES := $(addprefix ${BUILD_DIR}, doc.html) $(addprefix ${BUILD_DOC_DIR}, index.html style.css)
ORG_HTML := TODO.html

SERVE_LOCATION := /joust/
SERVE_LOCATION_DOC := $(addprefix ${SERVE_LOCATION}, doc/)
STATIC_LOCATION = $(addprefix ${SERVE_LOCATION}, static/)

all: doc
	npm run build-deploy || ((echo '--- NPM BUILD FAILED';echo '--- did you mean to `npm install`') && exit 1)

re: clean all

%.html: %.org
	`emacs -q $< --eval '(progn \
	(while (re-search-forward "$${SERVE_LOCATION_DOC}" nil t) \
		(replace-match "${SERVE_LOCATION_DOC}" t)) \
	(while (re-search-forward "$${STATIC_LOCATION}" nil t) \
		(replace-match "${STATIC_LOCATION}" t)) \
	(org-html-export-to-html) (kill-emacs))'`

${BUILD_DIR}:
	mkdir -p $@

${BUILD_DOC_DIR}:
	mkdir -p $@

${BUILD_DOC_DIR}index.html: ${ORG_HTML} ${BUILD_DOC_DIR}
	cp $< $@

${BUILD_DIR}doc.html: ${BUILD_DIR}
	echo '<meta http-equiv="refresh" content="0; URL=${SERVE_LOCATION}doc/" />' > $@

${BUILD_DOC_DIR}style.css: style.css ${BUILD_DOC_DIR}
	cp $< $@

# utility
joust:
	ln -s ${BUILD_DIR} joust

index.html:
	echo '<meta http-equiv="refresh" content="0; URL=${SERVE_LOCATION}" />' > $@

.PHONY: doc
doc: ${DOC_FILES}

.PHONY: clean
clean:
	${RM} ${ORG_HTML}
	${RM} ${BUILD_DIR}*.html ${BUILD_DIR}*.css ${BUILD_DIR}*.js
	${RM} ${DOC_FILES}
	rmdir ${BUILD_DOC_DIR}

j.zip:
	zip $@ src/* package* LICENSE README.md Makefile TODO.org style.css

.PHONY: zip
zip:
	${RM} j.zip
	${MAKE} j.zip

# testing
.PHONY: serve
serve: joust index.html
	php -S localhost:9090

.PHONY: start
start:
	npm start

.PHONY: run
run:
	npm start

.PHONY: lint
lint:
	npm run lint
