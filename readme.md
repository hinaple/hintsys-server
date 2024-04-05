# ROOM ESCAPE HINT SYSTEM - SERVER

---

## Tech Stack

| framework  | Socket    | Database |
| ---------- | --------- | -------- |
| Express.js | Socket.io | MySQL    |

---

## Document

### Objects

<details>
<summary>
<code><b>Theme</b></code>
<code>(Theme preview info)</code>
</summary>

##### Theme

> | key         | description                                | type   | default  |
> | ----------- | ------------------------------------------ | ------ | -------- |
> | idx         | The identified number of the theme         | Int    |          |
> | name        | The name or the title of the theme         | String |          |
> | time_limit  | The theme's limit time in minutes          | Int    | `60`     |
> | icon        | The theme's icon image URL                 | String |          |
> | theme_color | The CSS color code of the theme main color | String | `'#000'` |
> | createdAt   | When the theme has been created            | Date   |          |
> | updatedAt   | When the theme has been updated at last    | Date   |          |

</details>

<details>
<summary>
<code><b>Play_info</b></code>
<code>(Each playing simple information)</code>
</summary>

##### Play_info

> | key         | description                                                                        | type   | default   |
> | ----------- | ---------------------------------------------------------------------------------- | ------ | --------- |
> | idx         | The identified number of the playing info                                          | Int    |           |
> | theme_idx   | The linked theme idx                                                               | Int    |           |
> | status      | `'ready'` `'play'` `'pause'` `'end'`                                               | String | `'ready'` |
> | startedAt   | The exact time of the start playing. Only available when `status` is not `'ready'` | Date   |           |
> | pausedAt    | The exact time of the last pausing.                                                | Date   |           |
> | add_sec     | Seconds will be added to the total playing time.                                   | Int    |           |
> | device_info | The socket id of the connected hint device.                                        | Int    |           |
> | createdAt   | When the data has been created                                                     | Date   |           |
> | updatedAt   | When the data has been updated at last                                             | Date   |           |

</details>

<details>
<summary>
<code><b>Player_info</b></code>
<code>(Detailed player information)</code>
</summary>

##### Player_info

> | key  | description                        | type   | default |
> | ---- | ---------------------------------- | ------ | ------- |
> | name | The name of the player             | String |         |
> | tel  | The Telephone number of the player | String |         |

</details>

<details>
<summary>
<code><b>Setting</b></code>
<code>(A single Configuration)</code>
</summary>

##### Setting

> | key   | description  | type   | default |
> | ----- | ------------ | ------ | ------- |
> | label | config label | String |         |
> | value | config value | String |         |

</details>

<details>
<summary>
<code><b>Hint</b></code>
<code>(A single hint information including contents)</code>
</summary>

##### Hint

> | key      | description                                            | type   | default |
> | -------- | ------------------------------------------------------ | ------ | ------- |
> | idx      | The identified number of the hint                      | Int    |         |
> | code     | Hint code                                              | String |         |
> | progress | Progress of the hint for the whole theme (%)           | Float  |         |
> | contents | Each element contains `contents(String)`, `step(Int)`. | Array  |         |

</details>

<details>
<summary>
<code><b>Account</b></code>
<code>(An authentication account information)</code>
</summary>

##### Account

> | key       | description                                       | type        | default |
> | --------- | ------------------------------------------------- | ----------- | ------- |
> | idx       | Identified number of the account                  | Int         |         |
> | id        | Account ID                                        | String      |         |
> | password  | Account password                                  | String      |         |
> | alias     | Account alias (of course can be used as nickname) | String      |         |
> | level     | Security level                                    | Int         | 0       |
> | data      | Additional data                                   | JSON String |         |
> | createdAt | When the account has been created                 | Date        |         |
> | updatedAt | When the account has been updated at last         | Date        |         |

##### Security Level Indicator

> 'Specified' informations are stored in `data` column.

> | level | account type              | accessable points                                                                                 |
> | ----- | ------------------------- | ------------------------------------------------------------------------------------------------- |
> | 0     | Default Account           | N/A                                                                                               |
> | 1     | Low-Ranked Hint Device    | **readonly**: Specified theme and hint informations                                               |
> | 2     | High-Ranked Hint Device   | **readonly**: Every themes and hints inforations                                                  |
> | 3     | Low-Ranked Center Device  | Managing play info related to specified thems and hints, **readonly**: Specified themes and hints |
> | 4     | High-Ranked Center Device | Manaing every play infos, **readonly**: Every themes and hints                                    |
> | 5     | Low-Ranked Administrator  | Managing informations only related to specified themes                                            |
> | 6     | High-Ranked Administrator | Managing every informations                                                                       |
> | 9     | Master                    | Able to access and edit every data except accounts ranked the same                                |
> | 99    | Root                      | God                                                                                               |

</details>

### Endpoints

#### Theme

<details>

<summary>
<code>GET</code>
<code><b>/themes</b></code>
<code>(Get list of the themes)</code>
</summary>

##### Headers

> | name             | required | data type | description                |
> | ---------------- | -------- | --------- | -------------------------- |
> | Authorization-id | Y        | String    | Requires level 1 or higher |
> | Authorization-pw | Y        | String    |                            |

##### Responses

> | http code | content-type               | response                                |
> | --------- | -------------------------- | --------------------------------------- |
> | `201`     | `text/plain;charset=UTF-8` | Array of [Theme](#Theme)                |
> | `401`     | `application/json`         | `{"code":401,"message":"Unauthorized"}` |

</details>

<details>

<summary>
<code>POST</code>
<code><b>/theme</b></code>
<code>(Create a new theme info with title)</code>
</summary>

##### Headers

> | name             | required | data type | description                |
> | ---------------- | -------- | --------- | -------------------------- |
> | Authorization-id | Y        | String    | Requires level 6 or higher |
> | Authorization-pw | Y        | String    |                            |

##### Body

> | name | required | data type | description                             |
> | ---- | -------- | --------- | --------------------------------------- |
> | name | Y        | String    | The theme title (default `"New Theme"`) |

##### Responses

> | http code | content-type               | response                                  |
> | --------- | -------------------------- | ----------------------------------------- |
> | `201`     | `text/plain;charset=UTF-8` | `{"message": "Created Successfully"}`     |
> | `401`     | `application/json`         | `{"code":"401","message":"Unauthorized"}` |

</details>

<details>

<summary>
<code>PATCH</code>
<code><b>/theme/{idx}</b></code>
<code>(Update theme information)</code>
</summary>

##### Headers

> | name             | required | data type | description                |
> | ---------------- | -------- | --------- | -------------------------- |
> | Authorization-id | Y        | String    | Requires level 5 or higher |
> | Authorization-pw | Y        | String    |                            |

##### Parameters

> | name | data type | description      |
> | ---- | --------- | ---------------- |
> | idx  | Int       | Target theme idx |

##### Body

> | name       | required | data type | description                                    |
> | ---------- | -------- | --------- | ---------------------------------------------- |
> | updateData | Y        | Object    | `{"{updatingValueKey}": "{valueToUpdate}"...}` |

##### Responses

> | http code | content-type               | response                                |
> | --------- | -------------------------- | --------------------------------------- |
> | `201`     | `text/plain;charset=UTF-8` | `{"message": "Patched Successfully"}`   |
> | `401`     | `application/json`         | `{"code":401,"message":"Unauthorized"}` |

</details>

<details>

<summary>
<code>GET</code>
<code><b>/theme/{idx}</b></code>
<code>(Get full informations of the theme)</code>
</summary>

##### Headers

> | name             | required | data type | description                |
> | ---------------- | -------- | --------- | -------------------------- |
> | Authorization-id | Y        | String    | Requires level 1 or higher |
> | Authorization-pw | Y        | String    |                            |

##### Parameters

> | name | data type | description      |
> | ---- | --------- | ---------------- |
> | idx  | Int       | Target theme idx |

##### Responses

> | http code | content-type               | response                                             |
> | --------- | -------------------------- | ---------------------------------------------------- |
> | `201`     | `text/plain;charset=UTF-8` | [Theme](#Theme) but contains Array of [Hint](#Hint)s |
> | `401`     | `application/json`         | `{"code":401,"message":"Anauthorized"}`              |

</details>
