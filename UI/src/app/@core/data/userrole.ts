export abstract class UserRoleData {
    abstract getData(): any[];
    //abstract getUserRoleListing();
    abstract getScreenRoleList();
    abstract registerUser(newUserObject);
    abstract getRoleList();
    abstract createRole(roleName);
    abstract getScreenRoleInfo(roleId);
    abstract assignRoleUser(userObj);
    abstract assignRoleScreen(roleScreenObj);
    abstract assignAPIScreen(roleAPIObj);
}
