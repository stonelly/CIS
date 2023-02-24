export abstract class UserAccessData {
    abstract getData(): any[];
    abstract registerUser(newUserObject);
    abstract getUserListing();
    abstract searchADUser(ADUsernameText);
    abstract assignPlant(userPlan);
}
