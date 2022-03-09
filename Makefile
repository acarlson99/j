BUILD_DIR := docs/
BUILD_DOC_DIR := ${BUILD_DIR}doc/
DOC_FILES := $(addprefix ${BUILD_DIR}, doc.html) $(addprefix ${BUILD_DOC_DIR}, index.html style.css)
ORG_HTML := TODO.html

SERVE_LOCATION := /j/
SERVE_LOCATION_DOC := $(addprefix ${SERVE_LOCATION}, doc/)

all: doc
	npm run build-deploy || ((echo '--- NPM BUILD FAILED';echo '--- did you mean to `npm install`') && exit 1)

re: clean all

%.html: %.org
	emacs -q $< --eval '(progn (re-search-forward "style\.css" nil t) (replace-match "'$(addprefix ${SERVE_LOCATION_DOC}, style.css)'") (org-html-export-to-html) (kill-emacs))'

${BUILD_DIR}:
	mkdir -p $@

${BUILD_DOC_DIR}:
	mkdir -p $@

${BUILD_DOC_DIR}index.html: ${ORG_HTML} ${BUILD_DOC_DIR}
	cp $< $@

${BUILD_DIR}doc.html: ${BUILD_DIR}
	echo '<meta http-equiv="refresh" content="0; URL=/j/doc/" />' > $@

${BUILD_DOC_DIR}style.css: style.css ${BUILD_DOC_DIR}
	cp $< $@

# utility
j:
	ln -s ${BUILD_DIR} j

.PHONY: doc
doc: ${DOC_FILES}

.PHONY: clean
clean:
	${RM} ${ORG_HTML}
	rm -rf ${BUILD_DIR}

j.zip:
	zip $@ src/* package* LICENSE README.md Makefile TODO.org style.css

.PHONY: zip
zip:
	${RM} j.zip
	${MAKE} j.zip

# testing
.PHONY: serve
serve: j
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
