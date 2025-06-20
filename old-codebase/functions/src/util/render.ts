import * as ejs from "ejs";
import { join } from "path";
import * as minifyHtml from "@minify-html/js";

const cfg = minifyHtml.createConfiguration({
  minify_js: true,
  minify_css: true,

  // Keep valid HTML
  do_not_minify_doctype: true,
  ensure_spec_compliant_unquoted_attribute_values: true,
  keep_closing_tags: true,
  keep_html_and_head_opening_tags: true,
  keep_spaces_between_attributes: true,
});

export const render = (filename: string, data: any) =>
  new Promise<string | Buffer>((resolve, reject) => {
    let path = join(process.cwd(), "views", `${filename}.ejs`);
    ejs.renderFile(path, data, (err, str) => {
      if (err) reject(err);
      else {
        const html = minifyHtml.minify(str, cfg);

        resolve(html);
        // resolve(str);
      }
    });
  });
