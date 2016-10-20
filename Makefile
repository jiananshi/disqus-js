dev:
	webpack -w --progress

doc:
	docpress b
	cp -R _docpress/* .
