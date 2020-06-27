import { Component, OnInit } from '@angular/core';
import FlatfileImporter from "flatfile-csv-importer";

@Component({
  selector: 'app-contact-import',
  templateUrl: './contact-import.component.html',
  styleUrls: ['./contact-import.component.css']
})
export class ContactImportComponent implements OnInit {


  LICENSE_KEY = "9c54e6fe-d10e-4a83-b8ea-130e1a04c8d0";

  results = "[Your raw data will appear here]";

  private importer: FlatfileImporter;

  constructor() { }


  ngOnInit() {
    FlatfileImporter.setVersion(2);
    this.initializeImporter();
    this.importer.registerRecordHook((record, index) => {
      let out: any = {};
      // Check All Properties for strings like "Do Not Use",
      out = this.checkForDoNotUse(record, out);
      return out;
    });

    this.importer.registerFieldHook("firstName", values => {

      let changeValues = [];


      values.forEach((item:any) => {

        if (item[0].indexOf('&') > -1) {
          
          changeValues.push([
            {
              value: item[0] ,
              info: [
                {
                  message: 'This record may contain 2 contacts',
                  level: 'warning'
                }
              ]
            }
          ]);
        } 

      });


      return changeValues;

    });





    this.importer.setCustomer({
      userId: "123",
      name: "Jonathan"
    });
  }

  checkForDoNotUse(record, out) {

    var doNotStrings = [
      'do not',
      "don't use",
      "invalid",
      "duplicate"
    ]

    for (const property in record) {

      for (let i = 0; i < doNotStrings.length; i++) {
        const str = doNotStrings[i];
        
          if (record[property].toLowerCase().IndexOf(str) > -1) {

            
            out[property] = {
              value: record[property],
              info: [
                {
                  message: "Loan amounts were reformatted automatically",
                  level: "error"
                }
              ]
            };
          }
 
      }



    }

    return out;
  }

  async launchImporter() {

    try {
      let results = await this.importer.requestDataFromUser();
      this.importer.displayLoader();
      // emulate a server call, replace the timeout with an XHR request
      setTimeout(() => {
        this.importer.displaySuccess("Success!");
        this.results = JSON.stringify(results.validData, null, 2);
      }, 1500);
    } catch (e) {
      console.info(e || "window close");
    }
  }

  initializeImporter() {
    this.importer = new FlatfileImporter(this.LICENSE_KEY, {
      fields: [
        {
          label: 'Distinct ID',
          key: 'distinctId',
          validators: [
            {
              validate: "unique",
              error: "this is a unique field"
            }
          ]
        },
        {
          label: 'Prefix',
          key: 'prefix'
        },
        {
          label: 'First Name',
          key: 'firstName',
          validators: [
            {
              validate: "required",
              error: "this is a required field"
            }
          ]
        },
        {
          label: 'Last Name',
          key: 'lastName',
          validators: [
            {
              validate: "required",
              error: "this is a required field"
            }
          ]
        },
        {
          label: 'Address 1',
          key: 'addressLine1',
          alternates: ['address 1', 'address line 1']
        },
        {
          label: 'Address 2',
          key: 'addressLine2',
          alternates: ['address 2', 'address line 2']
        },
        {
          label: 'City',
          key: 'city'
        },
        {
          label: 'State',
          key: 'state'
        },
        {
          label: 'Postal Code',
          key: 'postalCode',
          alternates: ['Zip', 'Zip Code']
        },
        {
          label: 'Phone 1',
          key: 'phone1',
          alternates: ['cell', 'mobile', 'mobile phone', 'cell phone']
        },
        {
          label: 'Phone 2',
          key: 'phone2',
          alternates: ['work', 'work phone']
        },
        {
          label: 'Phone 3',
          key: 'phone3',
          alternates: ['fax', 'fax number']
        },
        {
          label: 'Phone 4',
          key: 'phone4'
        },
        {
          label: 'Email 1',
          key: 'email1',
          alternates: ['primary email', 'email address', 'home email', 'primary email address', 'home email address']
        },
        {
          label: 'Email 2',
          key: 'email2',
          alternates: ['secondary email', 'secondary email address', 'work email', 'work email address']
        },
        {
          label: 'Email 3',
          key: 'email3'
        },
        {
          label: 'Email 4',
          key: 'email4'
        },
        {
          label: 'Attention Flag',
          key: 'attentionFlag'
        },
        {
          label: 'Email 1',
          key: 'email1'
        }
      ],
      type: "Contacts",
      allowInvalidSubmit: true,
      managed: true,
      allowCustom: true,
      disableManualInput: true
    });
  }

}
