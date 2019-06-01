#!/bin/sh

SELF_PATH="$(dirname $(readlink -f "$0"))"
. "$SELF_PATH/scripts_environments"

run_command(){
	echo -n "Running ${0:2}..."
	bash -c "$*" &> "$tmpOutputFile"

	if [ $? = 0 ]; then
		echo -e " \033[0;32mOK!\033[0m"
	else
		echo -e " \033[0;31mFAILED!\033[0m\n"
		cat "$tmpOutputFile"

		echo -e "\033[0;31mSome check failed :(\033[0m"
		echo -e "\033[0;33mHave you tried to rebuilding the image? Try look the tool documentation as well!\033[0m"

        rm -rf "$tmpOutputFile"
		exit 1
	fi

    rm -rf "$tmpOutputFile"
}
