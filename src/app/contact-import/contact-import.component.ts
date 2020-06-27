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
      if (record.amount) {
        let numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
        let loanAmount = record.amount
          .split("")
          .filter(item => numbers.includes(item));
        out.amount = {
          value: loanAmount.join(""),
          info: [
            {
              message: "Loan amounts were reformatted automatically",
              level: "info"
            }
          ]
        };
      }
      return out;
    });
    this.importer.setCustomer({
      userId: "19234",
      name: "Foo Bar"
    });
  }

  async launchImporter() {
    if (!this.LICENSE_KEY) {
      return alert("Set LICENSE_KEY on Line 13 before continuing.");
    }
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
          label: "Loan Number",
          key: "load_id",
          alternates: ["number", "id number"],
          validators: [
            {
              validate: "regex_matches",
              regex: "^[a-zA-Z0-9]*$",
              error: "must be a valid alphanumeric loan number"
            },
            {
              validate: "required",
              error: "this is a required field"
            }
          ]
        },
        {
          label: "Loan Issuer",
          key: "issuer",
          description: "Name of the loan original issuer",
          validators: [
            {
              validate: "required",
              error: "this field is required"
            }
          ]
        },
        {
          label: "Loan Amount",
          key: "amount",
          validators: [
            {
              validate: "regex_matches",
              regex: "^[0-9]*$",
              error: "must be a numeric value"
            }
          ]
        },
        {
          label: "Loan Date",
          key: "date",
          alternates: ["issued at", "loan time", "date"],
          validators: [
            {
              validate: "required",
              error: "this is a required field"
            }
          ]
        },
        {
          label: "Contact Email",
          key: "email",
          description: "Email of loan issuer"
        }
      ],
      type: "Loans",
      allowInvalidSubmit: true,
      managed: true,
      allowCustom: true,
      disableManualInput: false
    });
  }

}
