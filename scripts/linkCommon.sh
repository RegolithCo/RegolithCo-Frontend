#!/bin/bash


# Get the absolute path of the current script
SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
WORKSPACE_DIR=$(dirname "$SCRIPT_DIR")
COMMON_DIR="$WORKSPACE_DIR/../Common"

rm -fr "$WORKSPACE_DIR/node_modules/@regolithco/common"

ln -s "$COMMON_DIR" "$WORKSPACE_DIR/node_modules/@regolithco/common"
echo "Linked @regolithco/common to $WORKSPACE_DIR/node_modules/@regolithco/common"