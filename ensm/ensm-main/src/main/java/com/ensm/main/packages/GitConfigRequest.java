package com.ensm.main.packages;

import lombok.Data;

@Data
public class GitConfigRequest {
    private String userName;
    private String userEmail;
    private String defaultBranch;
    private String initDefaultBranch;
    private String editor;
    private String coreAutocrlf;
    private Boolean pullRebase;
    private String credentialHelper;
    private Boolean httpSslVerify;
    private String pushDefault;
    private Boolean apply;
}

