find . -type f -name *.java -o -name *.js -o -name *.htm -o -name *.html -o -name *.less | grep -v node_modules | grep -v min | grep -v variables| xargs wc -l
