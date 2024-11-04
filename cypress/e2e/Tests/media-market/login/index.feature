Feature: Login page
    Background: Should be on the login page
        Given I am on the "https://dr0gho1wfdie5.cloudfront.net" page
    Scenario Outline: GUI
        Then I should see a "Title" as "Login to Account"
        Then I should see a "<element>" with default value "<defaultValue>"
        Examples:
            | element  | defaultValue |
            | Email    |              |
            | Password |              |
    Scenario Outline: FUNCTION
        When I enter "<username>" in the "Email" element
            And I enter "<password>" in the "Password" element
            And I click on the "LoginButton" button
        Then I should redirect to dashboard page
        Examples:
            | username              | password     |
            | hung@yopmail.com      | 123456789aA@ |
            | a222222@yopmail.com   | 123456789aA@ |
            | a33333333@yopmail.com | 123456789aA@ |
    Scenario: FUNCTION Login successfully
        When I enter "hung@yopmail.com" in the "Email" element
            And I enter "123456789aA@" in the "Password" element
            And I click on the "LoginButton" button
        Then I should redirect to dashboard page
    Scenario: FUNCTION Login failed
        When I enter "xxx@yopmail.com" in the "Email" element
            And I enter "123456789aA@" in the "Password" element
            And I click on the "LoginButton" button
        Then I should see error message "Email or password is incorrect"
