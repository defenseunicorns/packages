awk '{printf "%s\\n", $0}' ###ZARF_VAR_KEYCLOAK_KEY_FILE### | sed "s/\"/\\\\\"/g"
