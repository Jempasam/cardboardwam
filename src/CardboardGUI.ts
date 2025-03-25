import { html, MOValue } from "sam-lib"
import { CardboardWAM } from "./CardboardWAM"
import { ParamView } from "./utils/ParamView"
import { BooleanField, NumberField } from "./CardboardField"

import stylesheet from "./cardboard.css?url"

const UUID = "aa"//randomUUID().toString()

const PRESETS = {
    "Guitar": {"parameterValues":{"curve0":{"id":"curve0","value":0.14992721979621546,"normalized":false},"curve1":{"id":"curve1","value":0.39446870451237265,"normalized":false},"curve2":{"id":"curve2","value":0.6157205240174672,"normalized":false},"curve3":{"id":"curve3","value":0.4497816593886463,"normalized":false},"curve4":{"id":"curve4","value":0.44104803493449785,"normalized":false},"curve5":{"id":"curve5","value":0.2663755458515284,"normalized":false},"curve6":{"id":"curve6","value":0.5109170305676856,"normalized":false},"curve7":{"id":"curve7","value":0.38864628820960695,"normalized":false},"curve8":{"id":"curve8","value":0.519650655021834,"normalized":false},"curve9":{"id":"curve9","value":0.7729257641921397,"normalized":false},"curve10":{"id":"curve10","value":0.8806404657933044,"normalized":false},"curve11":{"id":"curve11","value":1,"normalized":false},"curve12":{"id":"curve12","value":0.7729257641921397,"normalized":false},"curve13":{"id":"curve13","value":0.7030567685589519,"normalized":false},"curve14":{"id":"curve14","value":0.16739446870451236,"normalized":false},"curve15":{"id":"curve15","value":-0.16739446870451236,"normalized":false},"curve16":{"id":"curve16","value":-0.7030567685589519,"normalized":false},"curve17":{"id":"curve17","value":-0.7729257641921397,"normalized":false},"curve18":{"id":"curve18","value":-1,"normalized":false},"curve19":{"id":"curve19","value":-0.8806404657933044,"normalized":false},"curve20":{"id":"curve20","value":-0.7729257641921397,"normalized":false},"curve21":{"id":"curve21","value":-0.519650655021834,"normalized":false},"curve22":{"id":"curve22","value":-0.38864628820960695,"normalized":false},"curve23":{"id":"curve23","value":-0.5109170305676856,"normalized":false},"curve24":{"id":"curve24","value":-0.2663755458515284,"normalized":false},"curve25":{"id":"curve25","value":-0.44104803493449785,"normalized":false},"curve26":{"id":"curve26","value":-0.4497816593886463,"normalized":false},"curve27":{"id":"curve27","value":-0.6157205240174672,"normalized":false},"curve28":{"id":"curve28","value":-0.39446870451237265,"normalized":false},"curve29":{"id":"curve29","value":-0.14992721979621546,"normalized":false},"attack0":{"id":"attack0","value":0,"normalized":false},"attack1":{"id":"attack1","value":0.1091703056768559,"normalized":false},"attack2":{"id":"attack2","value":0.32751091703056767,"normalized":false},"attack3":{"id":"attack3","value":0.4585152838427948,"normalized":false},"attack4":{"id":"attack4","value":0.5982532751091703,"normalized":false},"attack5":{"id":"attack5","value":0.7248908296943232,"normalized":false},"attack6":{"id":"attack6","value":0.8078602620087336,"normalized":false},"attack7":{"id":"attack7","value":0.868995633187773,"normalized":false},"attack8":{"id":"attack8","value":0.9126637554585153,"normalized":false},"attack9":{"id":"attack9","value":0.9432314410480349,"normalized":false},"attack10":{"id":"attack10","value":0.9432314410480349,"normalized":false},"attack11":{"id":"attack11","value":0.9432314410480349,"normalized":false},"attack12":{"id":"attack12","value":0.9432314410480349,"normalized":false},"attack13":{"id":"attack13","value":0.9432314410480349,"normalized":false},"attack14":{"id":"attack14","value":0.9432314410480349,"normalized":false},"attack15":{"id":"attack15","value":0.9432314410480349,"normalized":false},"attack16":{"id":"attack16","value":0.9432314410480349,"normalized":false},"attack17":{"id":"attack17","value":0.9432314410480349,"normalized":false},"attack18":{"id":"attack18","value":0.9432314410480349,"normalized":false},"attack19":{"id":"attack19","value":0.9432314410480349,"normalized":false},"attack20":{"id":"attack20","value":0.9432314410480349,"normalized":false},"attack21":{"id":"attack21","value":0.9432314410480349,"normalized":false},"attack22":{"id":"attack22","value":0.9432314410480349,"normalized":false},"attack23":{"id":"attack23","value":0.9432314410480349,"normalized":false},"attack24":{"id":"attack24","value":0.9432314410480349,"normalized":false},"attack25":{"id":"attack25","value":0.9432314410480349,"normalized":false},"attack26":{"id":"attack26","value":0.9432314410480349,"normalized":false},"attack27":{"id":"attack27","value":0.9432314410480349,"normalized":false},"attack28":{"id":"attack28","value":0.9432314410480349,"normalized":false},"attack29":{"id":"attack29","value":0.9432314410480349,"normalized":false},"attack_duration":{"id":"attack_duration","value":0.1,"normalized":false},"sustain0":{"id":"sustain0","value":1,"normalized":false},"sustain1":{"id":"sustain1","value":1,"normalized":false},"sustain2":{"id":"sustain2","value":1,"normalized":false},"sustain3":{"id":"sustain3","value":1,"normalized":false},"sustain4":{"id":"sustain4","value":1,"normalized":false},"sustain5":{"id":"sustain5","value":1,"normalized":false},"sustain6":{"id":"sustain6","value":1,"normalized":false},"sustain7":{"id":"sustain7","value":1,"normalized":false},"sustain8":{"id":"sustain8","value":1,"normalized":false},"sustain9":{"id":"sustain9","value":1,"normalized":false},"sustain10":{"id":"sustain10","value":1,"normalized":false},"sustain11":{"id":"sustain11","value":1,"normalized":false},"sustain12":{"id":"sustain12","value":1,"normalized":false},"sustain13":{"id":"sustain13","value":1,"normalized":false},"sustain14":{"id":"sustain14","value":1,"normalized":false},"sustain15":{"id":"sustain15","value":1,"normalized":false},"sustain16":{"id":"sustain16","value":1,"normalized":false},"sustain17":{"id":"sustain17","value":1,"normalized":false},"sustain18":{"id":"sustain18","value":1,"normalized":false},"sustain19":{"id":"sustain19","value":1,"normalized":false},"sustain20":{"id":"sustain20","value":1,"normalized":false},"sustain21":{"id":"sustain21","value":1,"normalized":false},"sustain22":{"id":"sustain22","value":1,"normalized":false},"sustain23":{"id":"sustain23","value":1,"normalized":false},"sustain24":{"id":"sustain24","value":1,"normalized":false},"sustain25":{"id":"sustain25","value":1,"normalized":false},"sustain26":{"id":"sustain26","value":1,"normalized":false},"sustain27":{"id":"sustain27","value":1,"normalized":false},"sustain28":{"id":"sustain28","value":1,"normalized":false},"sustain29":{"id":"sustain29","value":1,"normalized":false},"sustain_duration":{"id":"sustain_duration","value":0,"normalized":false},"sustain_loop":{"id":"sustain_loop","value":0,"normalized":false},"release0":{"id":"release0","value":1,"normalized":false},"release1":{"id":"release1","value":0.982532751091703,"normalized":false},"release2":{"id":"release2","value":0.8864628820960698,"normalized":false},"release3":{"id":"release3","value":0.7903930131004366,"normalized":false},"release4":{"id":"release4","value":0.5502183406113537,"normalized":false},"release5":{"id":"release5","value":0.6375545851528385,"normalized":false},"release6":{"id":"release6","value":0.7510917030567685,"normalized":false},"release7":{"id":"release7","value":0.8209606986899564,"normalized":false},"release8":{"id":"release8","value":0.8253275109170306,"normalized":false},"release9":{"id":"release9","value":0.8253275109170306,"normalized":false},"release10":{"id":"release10","value":0.8078602620087336,"normalized":false},"release11":{"id":"release11","value":0.759825327510917,"normalized":false},"release12":{"id":"release12","value":0.6157205240174672,"normalized":false},"release13":{"id":"release13","value":0.36681222707423583,"normalized":false},"release14":{"id":"release14","value":0.40611353711790393,"normalized":false},"release15":{"id":"release15","value":0.5109170305676856,"normalized":false},"release16":{"id":"release16","value":0.5807860262008734,"normalized":false},"release17":{"id":"release17","value":0.6157205240174672,"normalized":false},"release18":{"id":"release18","value":0.62882096069869,"normalized":false},"release19":{"id":"release19","value":0.5807860262008734,"normalized":false},"release20":{"id":"release20","value":0.5283842794759825,"normalized":false},"release21":{"id":"release21","value":0.3318777292576419,"normalized":false},"release22":{"id":"release22","value":0.22270742358078602,"normalized":false},"release23":{"id":"release23","value":0.31004366812227074,"normalized":false},"release24":{"id":"release24","value":0.37117903930131,"normalized":false},"release25":{"id":"release25","value":0.3799126637554585,"normalized":false},"release26":{"id":"release26","value":0.37554585152838427,"normalized":false},"release27":{"id":"release27","value":0.30131004366812225,"normalized":false},"release28":{"id":"release28","value":0.22270742358078602,"normalized":false},"release29":{"id":"release29","value":0.10043668122270742,"normalized":false},"release_duration":{"id":"release_duration","value":0.5,"normalized":false},"interpolate":{"id":"interpolate","value":1,"normalized":false}}},
    "Xylophone": {"parameterValues":{"curve0":{"id":"curve0","value":-1,"normalized":false},"curve1":{"id":"curve1","value":-0.8666666666666667,"normalized":false},"curve2":{"id":"curve2","value":-0.7333333333333334,"normalized":false},"curve3":{"id":"curve3","value":-0.6,"normalized":false},"curve4":{"id":"curve4","value":-0.4666666666666667,"normalized":false},"curve5":{"id":"curve5","value":-0.33333333333333337,"normalized":false},"curve6":{"id":"curve6","value":-0.19999999999999996,"normalized":false},"curve7":{"id":"curve7","value":-0.06666666666666665,"normalized":false},"curve8":{"id":"curve8","value":0.06666666666666665,"normalized":false},"curve9":{"id":"curve9","value":0.19999999999999996,"normalized":false},"curve10":{"id":"curve10","value":0.33333333333333326,"normalized":false},"curve11":{"id":"curve11","value":0.46666666666666656,"normalized":false},"curve12":{"id":"curve12","value":0.6000000000000001,"normalized":false},"curve13":{"id":"curve13","value":0.7333333333333334,"normalized":false},"curve14":{"id":"curve14","value":0.8666666666666667,"normalized":false},"curve15":{"id":"curve15","value":1,"normalized":false},"curve16":{"id":"curve16","value":0.8666666666666667,"normalized":false},"curve17":{"id":"curve17","value":0.7333333333333334,"normalized":false},"curve18":{"id":"curve18","value":0.6000000000000001,"normalized":false},"curve19":{"id":"curve19","value":0.4666666666666668,"normalized":false},"curve20":{"id":"curve20","value":0.3333333333333335,"normalized":false},"curve21":{"id":"curve21","value":0.20000000000000018,"normalized":false},"curve22":{"id":"curve22","value":0.06666666666666687,"normalized":false},"curve23":{"id":"curve23","value":-0.06666666666666687,"normalized":false},"curve24":{"id":"curve24","value":-0.20000000000000018,"normalized":false},"curve25":{"id":"curve25","value":-0.3333333333333335,"normalized":false},"curve26":{"id":"curve26","value":-0.4666666666666668,"normalized":false},"curve27":{"id":"curve27","value":-0.6000000000000001,"normalized":false},"curve28":{"id":"curve28","value":-0.7333333333333334,"normalized":false},"curve29":{"id":"curve29","value":-0.8666666666666667,"normalized":false},"attack0":{"id":"attack0","value":0,"normalized":false},"attack1":{"id":"attack1","value":0.9956331877729258,"normalized":false},"attack2":{"id":"attack2","value":0.9868995633187773,"normalized":false},"attack3":{"id":"attack3","value":0.9868995633187773,"normalized":false},"attack4":{"id":"attack4","value":0.9868995633187773,"normalized":false},"attack5":{"id":"attack5","value":0.9868995633187773,"normalized":false},"attack6":{"id":"attack6","value":0.9868995633187773,"normalized":false},"attack7":{"id":"attack7","value":0.9868995633187773,"normalized":false},"attack8":{"id":"attack8","value":0.9868995633187773,"normalized":false},"attack9":{"id":"attack9","value":0.9868995633187773,"normalized":false},"attack10":{"id":"attack10","value":0.9868995633187773,"normalized":false},"attack11":{"id":"attack11","value":0.9868995633187773,"normalized":false},"attack12":{"id":"attack12","value":0.9868995633187773,"normalized":false},"attack13":{"id":"attack13","value":0.982532751091703,"normalized":false},"attack14":{"id":"attack14","value":0.982532751091703,"normalized":false},"attack15":{"id":"attack15","value":0.982532751091703,"normalized":false},"attack16":{"id":"attack16","value":0.982532751091703,"normalized":false},"attack17":{"id":"attack17","value":0.982532751091703,"normalized":false},"attack18":{"id":"attack18","value":0.9650655021834061,"normalized":false},"attack19":{"id":"attack19","value":0.982532751091703,"normalized":false},"attack20":{"id":"attack20","value":0.982532751091703,"normalized":false},"attack21":{"id":"attack21","value":0.982532751091703,"normalized":false},"attack22":{"id":"attack22","value":1,"normalized":false},"attack23":{"id":"attack23","value":1,"normalized":false},"attack24":{"id":"attack24","value":0.9510565162951535,"normalized":false},"attack25":{"id":"attack25","value":0.9659258262890683,"normalized":false},"attack26":{"id":"attack26","value":0.9781476007338057,"normalized":false},"attack27":{"id":"attack27","value":0.9876883405951378,"normalized":false},"attack28":{"id":"attack28","value":0.9945218953682733,"normalized":false},"attack29":{"id":"attack29","value":0.9986295347545738,"normalized":false},"attack_duration":{"id":"attack_duration","value":0,"normalized":false},"sustain0":{"id":"sustain0","value":1,"normalized":false},"sustain1":{"id":"sustain1","value":1,"normalized":false},"sustain2":{"id":"sustain2","value":1,"normalized":false},"sustain3":{"id":"sustain3","value":1,"normalized":false},"sustain4":{"id":"sustain4","value":1,"normalized":false},"sustain5":{"id":"sustain5","value":1,"normalized":false},"sustain6":{"id":"sustain6","value":1,"normalized":false},"sustain7":{"id":"sustain7","value":1,"normalized":false},"sustain8":{"id":"sustain8","value":1,"normalized":false},"sustain9":{"id":"sustain9","value":1,"normalized":false},"sustain10":{"id":"sustain10","value":1,"normalized":false},"sustain11":{"id":"sustain11","value":1,"normalized":false},"sustain12":{"id":"sustain12","value":1,"normalized":false},"sustain13":{"id":"sustain13","value":1,"normalized":false},"sustain14":{"id":"sustain14","value":1,"normalized":false},"sustain15":{"id":"sustain15","value":1,"normalized":false},"sustain16":{"id":"sustain16","value":1,"normalized":false},"sustain17":{"id":"sustain17","value":1,"normalized":false},"sustain18":{"id":"sustain18","value":1,"normalized":false},"sustain19":{"id":"sustain19","value":1,"normalized":false},"sustain20":{"id":"sustain20","value":1,"normalized":false},"sustain21":{"id":"sustain21","value":1,"normalized":false},"sustain22":{"id":"sustain22","value":1,"normalized":false},"sustain23":{"id":"sustain23","value":1,"normalized":false},"sustain24":{"id":"sustain24","value":1,"normalized":false},"sustain25":{"id":"sustain25","value":1,"normalized":false},"sustain26":{"id":"sustain26","value":1,"normalized":false},"sustain27":{"id":"sustain27","value":1,"normalized":false},"sustain28":{"id":"sustain28","value":1,"normalized":false},"sustain29":{"id":"sustain29","value":1,"normalized":false},"sustain_duration":{"id":"sustain_duration","value":0,"normalized":false},"sustain_loop":{"id":"sustain_loop","value":0,"normalized":false},"release0":{"id":"release0","value":0.9082969432314411,"normalized":false},"release1":{"id":"release1","value":0.7030567685589519,"normalized":false},"release2":{"id":"release2","value":0.4847161572052402,"normalized":false},"release3":{"id":"release3","value":0.3318777292576419,"normalized":false},"release4":{"id":"release4","value":0.25327510917030566,"normalized":false},"release5":{"id":"release5","value":0.2096069868995633,"normalized":false},"release6":{"id":"release6","value":0.17903930131004367,"normalized":false},"release7":{"id":"release7","value":0.1703056768558952,"normalized":false},"release8":{"id":"release8","value":0.1615720524017467,"normalized":false},"release9":{"id":"release9","value":0.15283842794759825,"normalized":false},"release10":{"id":"release10","value":0.13100436681222707,"normalized":false},"release11":{"id":"release11","value":0.1091703056768559,"normalized":false},"release12":{"id":"release12","value":0.09606986899563319,"normalized":false},"release13":{"id":"release13","value":0.09606986899563319,"normalized":false},"release14":{"id":"release14","value":0.09170305676855896,"normalized":false},"release15":{"id":"release15","value":0.07860262008733625,"normalized":false},"release16":{"id":"release16","value":0.07423580786026202,"normalized":false},"release17":{"id":"release17","value":0.07423580786026202,"normalized":false},"release18":{"id":"release18","value":0.07423580786026202,"normalized":false},"release19":{"id":"release19","value":0.06550218340611354,"normalized":false},"release20":{"id":"release20","value":0.06550218340611354,"normalized":false},"release21":{"id":"release21","value":0.06550218340611354,"normalized":false},"release22":{"id":"release22","value":0.06550218340611354,"normalized":false},"release23":{"id":"release23","value":0.06550218340611354,"normalized":false},"release24":{"id":"release24","value":0.06550218340611354,"normalized":false},"release25":{"id":"release25","value":0.056768558951965066,"normalized":false},"release26":{"id":"release26","value":0.056768558951965066,"normalized":false},"release27":{"id":"release27","value":0.06550218340611354,"normalized":false},"release28":{"id":"release28","value":0.06550218340611354,"normalized":false},"release29":{"id":"release29","value":0.06550218340611354,"normalized":false},"release_duration":{"id":"release_duration","value":0.5,"normalized":false},"interpolate":{"id":"interpolate","value":1,"normalized":false}}},
    "Trumpet": {"parameterValues":{"curve0":{"id":"curve0","value":0.11499272197962156,"normalized":false},"curve1":{"id":"curve1","value":0.39737991266375544,"normalized":false},"curve2":{"id":"curve2","value":0.6098981077147015,"normalized":false},"curve3":{"id":"curve3","value":0.7467248908296943,"normalized":false},"curve4":{"id":"curve4","value":0.6273653566229985,"normalized":false},"curve5":{"id":"curve5","value":0.48762736535662304,"normalized":false},"curve6":{"id":"curve6","value":0.5516739446870452,"normalized":false},"curve7":{"id":"curve7","value":0.7292576419213974,"normalized":false},"curve8":{"id":"curve8","value":0.6914119359534207,"normalized":false},"curve9":{"id":"curve9","value":0.4294032023289665,"normalized":false},"curve10":{"id":"curve10","value":0.3857350800582242,"normalized":false},"curve11":{"id":"curve11","value":0.5623483745754488,"normalized":false},"curve12":{"id":"curve12","value":0.7069383794274624,"normalized":false},"curve13":{"id":"curve13","value":0.5361475012130034,"normalized":false},"curve14":{"id":"curve14","value":0.19844735565259583,"normalized":false},"curve15":{"id":"curve15","value":-0.19844735565259583,"normalized":false},"curve16":{"id":"curve16","value":-0.5361475012130034,"normalized":false},"curve17":{"id":"curve17","value":-0.7069383794274624,"normalized":false},"curve18":{"id":"curve18","value":-0.5623483745754488,"normalized":false},"curve19":{"id":"curve19","value":-0.3857350800582242,"normalized":false},"curve20":{"id":"curve20","value":-0.4294032023289665,"normalized":false},"curve21":{"id":"curve21","value":-0.6914119359534207,"normalized":false},"curve22":{"id":"curve22","value":-0.7292576419213974,"normalized":false},"curve23":{"id":"curve23","value":-0.5516739446870452,"normalized":false},"curve24":{"id":"curve24","value":-0.48762736535662304,"normalized":false},"curve25":{"id":"curve25","value":-0.6273653566229985,"normalized":false},"curve26":{"id":"curve26","value":-0.7467248908296943,"normalized":false},"curve27":{"id":"curve27","value":-0.6098981077147015,"normalized":false},"curve28":{"id":"curve28","value":-0.39737991266375544,"normalized":false},"curve29":{"id":"curve29","value":-0.11499272197962156,"normalized":false},"attack0":{"id":"attack0","value":0.11353711790393013,"normalized":false},"attack1":{"id":"attack1","value":0.22270742358078602,"normalized":false},"attack2":{"id":"attack2","value":0.3318777292576419,"normalized":false},"attack3":{"id":"attack3","value":0.42358078602620086,"normalized":false},"attack4":{"id":"attack4","value":0.5109170305676856,"normalized":false},"attack5":{"id":"attack5","value":0.5851528384279476,"normalized":false},"attack6":{"id":"attack6","value":0.6331877729257642,"normalized":false},"attack7":{"id":"attack7","value":0.6986899563318777,"normalized":false},"attack8":{"id":"attack8","value":0.7379912663755459,"normalized":false},"attack9":{"id":"attack9","value":0.759825327510917,"normalized":false},"attack10":{"id":"attack10","value":0.7816593886462883,"normalized":false},"attack11":{"id":"attack11","value":0.8165938864628821,"normalized":false},"attack12":{"id":"attack12","value":0.8427947598253275,"normalized":false},"attack13":{"id":"attack13","value":0.8471615720524017,"normalized":false},"attack14":{"id":"attack14","value":0.8602620087336245,"normalized":false},"attack15":{"id":"attack15","value":0.868995633187773,"normalized":false},"attack16":{"id":"attack16","value":0.8864628820960698,"normalized":false},"attack17":{"id":"attack17","value":0.9126637554585153,"normalized":false},"attack18":{"id":"attack18","value":0.9301310043668122,"normalized":false},"attack19":{"id":"attack19","value":0.9563318777292577,"normalized":false},"attack20":{"id":"attack20","value":0.9737991266375546,"normalized":false},"attack21":{"id":"attack21","value":0.982532751091703,"normalized":false},"attack22":{"id":"attack22","value":1,"normalized":false},"attack23":{"id":"attack23","value":1,"normalized":false},"attack24":{"id":"attack24","value":1,"normalized":false},"attack25":{"id":"attack25","value":1,"normalized":false},"attack26":{"id":"attack26","value":0.9781476007338057,"normalized":false},"attack27":{"id":"attack27","value":0.9876883405951378,"normalized":false},"attack28":{"id":"attack28","value":0.9945218953682733,"normalized":false},"attack29":{"id":"attack29","value":0.9986295347545738,"normalized":false},"attack_duration":{"id":"attack_duration","value":0.1,"normalized":false},"sustain0":{"id":"sustain0","value":0.9475982532751092,"normalized":false},"sustain1":{"id":"sustain1","value":0.9126637554585153,"normalized":false},"sustain2":{"id":"sustain2","value":0.8820960698689956,"normalized":false},"sustain3":{"id":"sustain3","value":0.8777292576419214,"normalized":false},"sustain4":{"id":"sustain4","value":0.868995633187773,"normalized":false},"sustain5":{"id":"sustain5","value":0.8602620087336245,"normalized":false},"sustain6":{"id":"sustain6","value":0.8602620087336245,"normalized":false},"sustain7":{"id":"sustain7","value":0.8602620087336245,"normalized":false},"sustain8":{"id":"sustain8","value":0.8602620087336245,"normalized":false},"sustain9":{"id":"sustain9","value":0.8602620087336245,"normalized":false},"sustain10":{"id":"sustain10","value":0.8602620087336245,"normalized":false},"sustain11":{"id":"sustain11","value":0.8602620087336245,"normalized":false},"sustain12":{"id":"sustain12","value":0.8602620087336245,"normalized":false},"sustain13":{"id":"sustain13","value":0.8646288209606987,"normalized":false},"sustain14":{"id":"sustain14","value":0.8646288209606987,"normalized":false},"sustain15":{"id":"sustain15","value":0.8777292576419214,"normalized":false},"sustain16":{"id":"sustain16","value":0.8777292576419214,"normalized":false},"sustain17":{"id":"sustain17","value":0.8820960698689956,"normalized":false},"sustain18":{"id":"sustain18","value":0.8820960698689956,"normalized":false},"sustain19":{"id":"sustain19","value":0.8820960698689956,"normalized":false},"sustain20":{"id":"sustain20","value":0.8820960698689956,"normalized":false},"sustain21":{"id":"sustain21","value":0.8820960698689956,"normalized":false},"sustain22":{"id":"sustain22","value":0.8951965065502183,"normalized":false},"sustain23":{"id":"sustain23","value":0.8995633187772926,"normalized":false},"sustain24":{"id":"sustain24","value":0.9170305676855895,"normalized":false},"sustain25":{"id":"sustain25","value":0.9170305676855895,"normalized":false},"sustain26":{"id":"sustain26","value":0.9388646288209607,"normalized":false},"sustain27":{"id":"sustain27","value":0.9475982532751092,"normalized":false},"sustain28":{"id":"sustain28","value":0.9781659388646288,"normalized":false},"sustain29":{"id":"sustain29","value":0.9956331877729258,"normalized":false},"sustain_duration":{"id":"sustain_duration","value":0.2,"normalized":false},"sustain_loop":{"id":"sustain_loop","value":1,"normalized":false},"release0":{"id":"release0","value":0.9388646288209607,"normalized":false},"release1":{"id":"release1","value":0.9213973799126638,"normalized":false},"release2":{"id":"release2","value":0.8777292576419214,"normalized":false},"release3":{"id":"release3","value":0.8471615720524017,"normalized":false},"release4":{"id":"release4","value":0.8209606986899564,"normalized":false},"release5":{"id":"release5","value":0.7554585152838428,"normalized":false},"release6":{"id":"release6","value":0.5807860262008734,"normalized":false},"release7":{"id":"release7","value":0.49344978165938863,"normalized":false},"release8":{"id":"release8","value":0.47161572052401746,"normalized":false},"release9":{"id":"release9","value":0.47161572052401746,"normalized":false},"release10":{"id":"release10","value":0.4759825327510917,"normalized":false},"release11":{"id":"release11","value":0.49344978165938863,"normalized":false},"release12":{"id":"release12","value":0.5240174672489083,"normalized":false},"release13":{"id":"release13","value":0.5283842794759825,"normalized":false},"release14":{"id":"release14","value":0.5283842794759825,"normalized":false},"release15":{"id":"release15","value":0.4672489082969432,"normalized":false},"release16":{"id":"release16","value":0.2838427947598253,"normalized":false},"release17":{"id":"release17","value":0.1965065502183406,"normalized":false},"release18":{"id":"release18","value":0.17903930131004367,"normalized":false},"release19":{"id":"release19","value":0.1615720524017467,"normalized":false},"release20":{"id":"release20","value":0.16593886462882096,"normalized":false},"release21":{"id":"release21","value":0.19213973799126638,"normalized":false},"release22":{"id":"release22","value":0.22707423580786026,"normalized":false},"release23":{"id":"release23","value":0.24017467248908297,"normalized":false},"release24":{"id":"release24","value":0.2576419213973799,"normalized":false},"release25":{"id":"release25","value":0.2576419213973799,"normalized":false},"release26":{"id":"release26","value":0.22707423580786026,"normalized":false},"release27":{"id":"release27","value":0.17467248908296942,"normalized":false},"release28":{"id":"release28","value":0.13537117903930132,"normalized":false},"release29":{"id":"release29","value":0.06550218340611354,"normalized":false},"release_duration":{"id":"release_duration","value":0.5,"normalized":false},"interpolate":{"id":"interpolate","value":1,"normalized":false}}},
    "Flute": {"parameterValues":{"curve0":{"id":"curve0","value":-0.0700707754048647,"normalized":false},"curve1":{"id":"curve1","value":0.21159230264595133,"normalized":false},"curve2":{"id":"curve2","value":0.47449463194777114,"normalized":false},"curve3":{"id":"curve3","value":0.6823557653029916,"normalized":false},"curve4":{"id":"curve4","value":0.8120711872604526,"normalized":false},"curve5":{"id":"curve5","value":0.8728033448928532,"normalized":false},"curve6":{"id":"curve6","value":0.9005317535781424,"normalized":false},"curve7":{"id":"curve7","value":0.9166016530228384,"normalized":false},"curve8":{"id":"curve8","value":0.9402339355619577,"normalized":false},"curve9":{"id":"curve9","value":0.9513224444427927,"normalized":false},"curve10":{"id":"curve10","value":0.9312113896632789,"normalized":false},"curve11":{"id":"curve11","value":0.8558749366358122,"normalized":false},"curve12":{"id":"curve12","value":0.7055119218491651,"normalized":false},"curve13":{"id":"curve13","value":0.5000387353465062,"normalized":false},"curve14":{"id":"curve14","value":0.24733238546127237,"normalized":false},"curve15":{"id":"curve15","value":0.00981588039050966,"normalized":false},"curve16":{"id":"curve16","value":-0.20842916314101215,"normalized":false},"curve17":{"id":"curve17","value":-0.37949695691091606,"normalized":false},"curve18":{"id":"curve18","value":-0.5490267591381892,"normalized":false},"curve19":{"id":"curve19","value":-0.7027231148648441,"normalized":false},"curve20":{"id":"curve20","value":-0.8420946914457961,"normalized":false},"curve21":{"id":"curve21","value":-0.9300086470915173,"normalized":false},"curve22":{"id":"curve22","value":-0.9715632742620935,"normalized":false},"curve23":{"id":"curve23","value":-0.9738792773539494,"normalized":false},"curve24":{"id":"curve24","value":-0.9418393994503372,"normalized":false},"curve25":{"id":"curve25","value":-0.8843108952720821,"normalized":false},"curve26":{"id":"curve26","value":-0.7927062832129431,"normalized":false},"curve27":{"id":"curve27","value":-0.6796885234076049,"normalized":false},"curve28":{"id":"curve28","value":-0.5255851593279074,"normalized":false},"curve29":{"id":"curve29","value":-0.3236583645049736,"normalized":false},"attack0":{"id":"attack0","value":0,"normalized":false},"attack1":{"id":"attack1","value":0.05233595624294383,"normalized":false},"attack2":{"id":"attack2","value":0.10452846326765346,"normalized":false},"attack3":{"id":"attack3","value":0.15643446504023087,"normalized":false},"attack4":{"id":"attack4","value":0.20791169081775931,"normalized":false},"attack5":{"id":"attack5","value":0.25881904510252074,"normalized":false},"attack6":{"id":"attack6","value":0.3090169943749474,"normalized":false},"attack7":{"id":"attack7","value":0.35836794954530027,"normalized":false},"attack8":{"id":"attack8","value":0.40673664307580015,"normalized":false},"attack9":{"id":"attack9","value":0.45399049973954675,"normalized":false},"attack10":{"id":"attack10","value":0.49999999999999994,"normalized":false},"attack11":{"id":"attack11","value":0.544639035015027,"normalized":false},"attack12":{"id":"attack12","value":0.5877852522924731,"normalized":false},"attack13":{"id":"attack13","value":0.6293203910498375,"normalized":false},"attack14":{"id":"attack14","value":0.6691306063588582,"normalized":false},"attack15":{"id":"attack15","value":0.7071067811865476,"normalized":false},"attack16":{"id":"attack16","value":0.7431448254773941,"normalized":false},"attack17":{"id":"attack17","value":0.7771459614569708,"normalized":false},"attack18":{"id":"attack18","value":0.8090169943749475,"normalized":false},"attack19":{"id":"attack19","value":0.8386705679454239,"normalized":false},"attack20":{"id":"attack20","value":0.8660254037844386,"normalized":false},"attack21":{"id":"attack21","value":0.8910065241883678,"normalized":false},"attack22":{"id":"attack22","value":0.9135454576426009,"normalized":false},"attack23":{"id":"attack23","value":0.9335804264972017,"normalized":false},"attack24":{"id":"attack24","value":0.9510565162951535,"normalized":false},"attack25":{"id":"attack25","value":0.9659258262890683,"normalized":false},"attack26":{"id":"attack26","value":0.9781476007338057,"normalized":false},"attack27":{"id":"attack27","value":0.9876883405951378,"normalized":false},"attack28":{"id":"attack28","value":0.9945218953682733,"normalized":false},"attack29":{"id":"attack29","value":0.9986295347545738,"normalized":false},"attack_duration":{"id":"attack_duration","value":0.3,"normalized":false},"sustain0":{"id":"sustain0","value":0.9694323144104804,"normalized":false},"sustain1":{"id":"sustain1","value":0.9475982532751092,"normalized":false},"sustain2":{"id":"sustain2","value":0.9301310043668122,"normalized":false},"sustain3":{"id":"sustain3","value":0.9301310043668122,"normalized":false},"sustain4":{"id":"sustain4","value":0.9301310043668122,"normalized":false},"sustain5":{"id":"sustain5","value":0.9301310043668122,"normalized":false},"sustain6":{"id":"sustain6","value":0.9301310043668122,"normalized":false},"sustain7":{"id":"sustain7","value":0.9301310043668122,"normalized":false},"sustain8":{"id":"sustain8","value":0.9170305676855895,"normalized":false},"sustain9":{"id":"sustain9","value":0.9170305676855895,"normalized":false},"sustain10":{"id":"sustain10","value":0.9126637554585153,"normalized":false},"sustain11":{"id":"sustain11","value":0.9039301310043668,"normalized":false},"sustain12":{"id":"sustain12","value":0.9039301310043668,"normalized":false},"sustain13":{"id":"sustain13","value":0.9039301310043668,"normalized":false},"sustain14":{"id":"sustain14","value":0.9039301310043668,"normalized":false},"sustain15":{"id":"sustain15","value":0.8995633187772926,"normalized":false},"sustain16":{"id":"sustain16","value":0.8951965065502183,"normalized":false},"sustain17":{"id":"sustain17","value":0.8951965065502183,"normalized":false},"sustain18":{"id":"sustain18","value":0.8951965065502183,"normalized":false},"sustain19":{"id":"sustain19","value":0.8777292576419214,"normalized":false},"sustain20":{"id":"sustain20","value":0.8602620087336245,"normalized":false},"sustain21":{"id":"sustain21","value":0.8427947598253275,"normalized":false},"sustain22":{"id":"sustain22","value":0.8384279475982532,"normalized":false},"sustain23":{"id":"sustain23","value":0.8122270742358079,"normalized":false},"sustain24":{"id":"sustain24","value":0.8078602620087336,"normalized":false},"sustain25":{"id":"sustain25","value":0.8078602620087336,"normalized":false},"sustain26":{"id":"sustain26","value":0.8209606986899564,"normalized":false},"sustain27":{"id":"sustain27","value":0.8384279475982532,"normalized":false},"sustain28":{"id":"sustain28","value":0.8646288209606987,"normalized":false},"sustain29":{"id":"sustain29","value":0.9301310043668122,"normalized":false},"sustain_duration":{"id":"sustain_duration","value":0.2,"normalized":false},"sustain_loop":{"id":"sustain_loop","value":1,"normalized":false},"release0":{"id":"release0","value":1,"normalized":false},"release1":{"id":"release1","value":0.9986295347545738,"normalized":false},"release2":{"id":"release2","value":0.9945218953682734,"normalized":false},"release3":{"id":"release3","value":0.9876883405951377,"normalized":false},"release4":{"id":"release4","value":0.9781476007338057,"normalized":false},"release5":{"id":"release5","value":0.9659258262890683,"normalized":false},"release6":{"id":"release6","value":0.9510565162951536,"normalized":false},"release7":{"id":"release7","value":0.9335804264972017,"normalized":false},"release8":{"id":"release8","value":0.913545457642601,"normalized":false},"release9":{"id":"release9","value":0.8910065241883679,"normalized":false},"release10":{"id":"release10","value":0.8660254037844387,"normalized":false},"release11":{"id":"release11","value":0.838670567945424,"normalized":false},"release12":{"id":"release12","value":0.8090169943749475,"normalized":false},"release13":{"id":"release13","value":0.777145961456971,"normalized":false},"release14":{"id":"release14","value":0.7431448254773942,"normalized":false},"release15":{"id":"release15","value":0.7071067811865476,"normalized":false},"release16":{"id":"release16","value":0.6691306063588583,"normalized":false},"release17":{"id":"release17","value":0.6293203910498374,"normalized":false},"release18":{"id":"release18","value":0.5877852522924732,"normalized":false},"release19":{"id":"release19","value":0.5446390350150273,"normalized":false},"release20":{"id":"release20","value":0.5000000000000003,"normalized":false},"release21":{"id":"release21","value":0.45399049973954686,"normalized":false},"release22":{"id":"release22","value":0.40673664307580004,"normalized":false},"release23":{"id":"release23","value":0.35836794954530066,"normalized":false},"release24":{"id":"release24","value":0.3090169943749475,"normalized":false},"release25":{"id":"release25","value":0.2588190451025206,"normalized":false},"release26":{"id":"release26","value":0.20791169081775931,"normalized":false},"release27":{"id":"release27","value":0.15643446504023098,"normalized":false},"release28":{"id":"release28","value":0.10452846326765373,"normalized":false},"release29":{"id":"release29","value":0.05233595624294381,"normalized":false},"release_duration":{"id":"release_duration","value":0.5,"normalized":false},"interpolate":{"id":"interpolate","value":1,"normalized":false}}},
    "Clarinet": {"parameterValues":{"curve0":{"id":"curve0","value":0.6666666666666666,"normalized":false},"curve1":{"id":"curve1","value":0.5256410256410257,"normalized":false},"curve2":{"id":"curve2","value":0.2532051282051282,"normalized":false},"curve3":{"id":"curve3","value":-0.028846153846153855,"normalized":false},"curve4":{"id":"curve4","value":-0.2884615384615385,"normalized":false},"curve5":{"id":"curve5","value":-0.5544871794871795,"normalized":false},"curve6":{"id":"curve6","value":-0.7403846153846153,"normalized":false},"curve7":{"id":"curve7","value":-0.7596153846153846,"normalized":false},"curve8":{"id":"curve8","value":-0.5448717948717948,"normalized":false},"curve9":{"id":"curve9","value":-0.22115384615384617,"normalized":false},"curve10":{"id":"curve10","value":0.03525641025641024,"normalized":false},"curve11":{"id":"curve11","value":0.019230769230769235,"normalized":false},"curve12":{"id":"curve12","value":-0.2756410256410256,"normalized":false},"curve13":{"id":"curve13","value":-0.5608974358974359,"normalized":false},"curve14":{"id":"curve14","value":-0.5865384615384616,"normalized":false},"curve15":{"id":"curve15","value":-0.30448717948717946,"normalized":false},"curve16":{"id":"curve16","value":-0.028846153846153855,"normalized":false},"curve17":{"id":"curve17","value":-0.08012820512820513,"normalized":false},"curve18":{"id":"curve18","value":-0.5,"normalized":false},"curve19":{"id":"curve19","value":-0.5673076923076923,"normalized":false},"curve20":{"id":"curve20","value":-0.5160256410256411,"normalized":false},"curve21":{"id":"curve21","value":-0.20833333333333337,"normalized":false},"curve22":{"id":"curve22","value":0.17948717948717943,"normalized":false},"curve23":{"id":"curve23","value":0.4038461538461538,"normalized":false},"curve24":{"id":"curve24","value":0.5288461538461539,"normalized":false},"curve25":{"id":"curve25","value":0.5448717948717948,"normalized":false},"curve26":{"id":"curve26","value":0.4775641025641026,"normalized":false},"curve27":{"id":"curve27","value":0.41987179487179493,"normalized":false},"curve28":{"id":"curve28","value":0.45512820512820523,"normalized":false},"curve29":{"id":"curve29","value":0.6121794871794872,"normalized":false},"attack0":{"id":"attack0","value":0.038461538461538464,"normalized":false},"attack1":{"id":"attack1","value":0.038461538461538464,"normalized":false},"attack2":{"id":"attack2","value":0.04807692307692308,"normalized":false},"attack3":{"id":"attack3","value":0.057692307692307696,"normalized":false},"attack4":{"id":"attack4","value":0.07692307692307693,"normalized":false},"attack5":{"id":"attack5","value":0.07692307692307693,"normalized":false},"attack6":{"id":"attack6","value":0.07692307692307693,"normalized":false},"attack7":{"id":"attack7","value":0.07692307692307693,"normalized":false},"attack8":{"id":"attack8","value":0.07692307692307693,"normalized":false},"attack9":{"id":"attack9","value":0.07692307692307693,"normalized":false},"attack10":{"id":"attack10","value":0.07692307692307693,"normalized":false},"attack11":{"id":"attack11","value":0.07692307692307693,"normalized":false},"attack12":{"id":"attack12","value":0.08173076923076923,"normalized":false},"attack13":{"id":"attack13","value":0.09615384615384616,"normalized":false},"attack14":{"id":"attack14","value":0.09615384615384616,"normalized":false},"attack15":{"id":"attack15","value":0.09615384615384616,"normalized":false},"attack16":{"id":"attack16","value":0.11538461538461539,"normalized":false},"attack17":{"id":"attack17","value":0.1346153846153846,"normalized":false},"attack18":{"id":"attack18","value":0.16826923076923078,"normalized":false},"attack19":{"id":"attack19","value":0.1971153846153846,"normalized":false},"attack20":{"id":"attack20","value":0.21153846153846154,"normalized":false},"attack21":{"id":"attack21","value":0.25,"normalized":false},"attack22":{"id":"attack22","value":0.28846153846153844,"normalized":false},"attack23":{"id":"attack23","value":0.3605769230769231,"normalized":false},"attack24":{"id":"attack24","value":0.40865384615384615,"normalized":false},"attack25":{"id":"attack25","value":0.47596153846153844,"normalized":false},"attack26":{"id":"attack26","value":0.5913461538461539,"normalized":false},"attack27":{"id":"attack27","value":0.6971153846153846,"normalized":false},"attack28":{"id":"attack28","value":0.8317307692307693,"normalized":false},"attack29":{"id":"attack29","value":0.9230769230769231,"normalized":false},"attack_duration":{"id":"attack_duration","value":0.2,"normalized":false},"sustain0":{"id":"sustain0","value":0.9375,"normalized":false},"sustain1":{"id":"sustain1","value":0.8317307692307693,"normalized":false},"sustain2":{"id":"sustain2","value":0.7596153846153846,"normalized":false},"sustain3":{"id":"sustain3","value":0.7259615384615384,"normalized":false},"sustain4":{"id":"sustain4","value":0.6875,"normalized":false},"sustain5":{"id":"sustain5","value":0.6394230769230769,"normalized":false},"sustain6":{"id":"sustain6","value":0.5961538461538461,"normalized":false},"sustain7":{"id":"sustain7","value":0.5384615384615384,"normalized":false},"sustain8":{"id":"sustain8","value":0.5,"normalized":false},"sustain9":{"id":"sustain9","value":0.46153846153846156,"normalized":false},"sustain10":{"id":"sustain10","value":0.4375,"normalized":false},"sustain11":{"id":"sustain11","value":0.41346153846153844,"normalized":false},"sustain12":{"id":"sustain12","value":0.3942307692307692,"normalized":false},"sustain13":{"id":"sustain13","value":0.36538461538461536,"normalized":false},"sustain14":{"id":"sustain14","value":0.34134615384615385,"normalized":false},"sustain15":{"id":"sustain15","value":0.3076923076923077,"normalized":false},"sustain16":{"id":"sustain16","value":0.3173076923076923,"normalized":false},"sustain17":{"id":"sustain17","value":0.28846153846153844,"normalized":false},"sustain18":{"id":"sustain18","value":0.25,"normalized":false},"sustain19":{"id":"sustain19","value":0.23557692307692307,"normalized":false},"sustain20":{"id":"sustain20","value":0.22596153846153846,"normalized":false},"sustain21":{"id":"sustain21","value":0.21153846153846154,"normalized":false},"sustain22":{"id":"sustain22","value":0.17307692307692307,"normalized":false},"sustain23":{"id":"sustain23","value":0.16346153846153846,"normalized":false},"sustain24":{"id":"sustain24","value":0.15384615384615385,"normalized":false},"sustain25":{"id":"sustain25","value":0.14423076923076922,"normalized":false},"sustain26":{"id":"sustain26","value":0.1346153846153846,"normalized":false},"sustain27":{"id":"sustain27","value":0.09615384615384616,"normalized":false},"sustain28":{"id":"sustain28","value":0.08653846153846154,"normalized":false},"sustain29":{"id":"sustain29","value":0.04326923076923077,"normalized":false},"sustain_duration":{"id":"sustain_duration","value":3,"normalized":false},"sustain_loop":{"id":"sustain_loop","value":0,"normalized":false},"release0":{"id":"release0","value":0.8317307692307693,"normalized":false},"release1":{"id":"release1","value":0.6105769230769231,"normalized":false},"release2":{"id":"release2","value":0.5192307692307693,"normalized":false},"release3":{"id":"release3","value":0.46634615384615385,"normalized":false},"release4":{"id":"release4","value":0.4230769230769231,"normalized":false},"release5":{"id":"release5","value":0.3701923076923077,"normalized":false},"release6":{"id":"release6","value":0.36538461538461536,"normalized":false},"release7":{"id":"release7","value":0.3173076923076923,"normalized":false},"release8":{"id":"release8","value":0.27403846153846156,"normalized":false},"release9":{"id":"release9","value":0.22596153846153846,"normalized":false},"release10":{"id":"release10","value":0.1875,"normalized":false},"release11":{"id":"release11","value":0.16826923076923078,"normalized":false},"release12":{"id":"release12","value":0.15384615384615385,"normalized":false},"release13":{"id":"release13","value":0.1346153846153846,"normalized":false},"release14":{"id":"release14","value":0.12980769230769232,"normalized":false},"release15":{"id":"release15","value":0.12980769230769232,"normalized":false},"release16":{"id":"release16","value":0.11538461538461539,"normalized":false},"release17":{"id":"release17","value":0.09615384615384616,"normalized":false},"release18":{"id":"release18","value":0.09615384615384616,"normalized":false},"release19":{"id":"release19","value":0.09615384615384616,"normalized":false},"release20":{"id":"release20","value":0.08653846153846154,"normalized":false},"release21":{"id":"release21","value":0.08653846153846154,"normalized":false},"release22":{"id":"release22","value":0.08653846153846154,"normalized":false},"release23":{"id":"release23","value":0.07692307692307693,"normalized":false},"release24":{"id":"release24","value":0.07692307692307693,"normalized":false},"release25":{"id":"release25","value":0.07211538461538461,"normalized":false},"release26":{"id":"release26","value":0.07211538461538461,"normalized":false},"release27":{"id":"release27","value":0.07211538461538461,"normalized":false},"release28":{"id":"release28","value":0.08173076923076923,"normalized":false},"release29":{"id":"release29","value":0.08173076923076923,"normalized":false},"release_duration":{"id":"release_duration","value":0.4,"normalized":false},"interpolate":{"id":"interpolate","value":1,"normalized":false}}}
}

export class CardboardGUI extends HTMLElement{

    static NAME = `card-cardboard${UUID}`
    static RESOLUTION = 30
    
    #paramview: ParamView
    wave: Array<MOValue<number>>
    attack: Array<MOValue<number>>
    release: Array<MOValue<number>>
    sustain: Array<MOValue<number>>
    interpolate: MOValue<number>
    attack_duration: MOValue<number>
    release_duration: MOValue<number>
    sustain_duration: MOValue<number>
    sustain_loop: MOValue<number>

    #observers: (()=>void)[] = []

    #root

    constructor(public wam: CardboardWAM){
        super()
        this.#root=this.attachShadow({mode:"closed"})
        
        this.#paramview = new ParamView(wam.audioNode)
        this.wave = Array.from({length:CardboardGUI.RESOLUTION},(_,i)=>this.#paramview.addParameter(`curve${i}`))
        this.attack = Array.from({length:CardboardGUI.RESOLUTION},(_,i)=>this.#paramview.addParameter(`attack${i}`))
        this.release = Array.from({length:CardboardGUI.RESOLUTION},(_,i)=>this.#paramview.addParameter(`release${i}`))
        this.sustain = Array.from({length:CardboardGUI.RESOLUTION},(_,i)=>this.#paramview.addParameter(`sustain${i}`))
        this.interpolate = this.#paramview.addParameter("interpolate")
        this.attack_duration = this.#paramview.addParameter("attack_duration")
        this.release_duration = this.#paramview.addParameter("release_duration")
        this.sustain_duration = this.#paramview.addParameter("sustain_duration")
        this.sustain_loop = this.#paramview.addParameter("sustain_loop")
    }

    selectedMenu = "preset"

    connectedCallback(){
        this.#observers.forEach(o=>o())
        this.#observers = []
        const gui = this
        let content: DocumentFragment


        // Content
        if(this.selectedMenu=="wave"){
            const curve = new Curve(
                -1,1, 0, true,
                null,
                [{index:this.wave.length/2,name:""}],
                this.wave
            )
    
            const interpolate = new BooleanField(this.interpolate, "Interpolate curve points", "interpolate")

            const symmetrize = html.a`<button title="Symmetrize the wave">Symmetrize</button>`
            symmetrize.onclick = ()=>{
                for(let i=0; i<this.wave.length/2; i++){
                    this.wave[this.wave.length-1-i].set(-this.wave[i].value)
                }
            }

            const smooth = html.a`<button title="Smooth the wave shape">Smooth</button>`
            smooth.onclick = ()=>{
                const before = this.wave.map(it=>it.value)
                for(let i=0; i<this.wave.length; i++){
                    let value = 0
                    value += before[(i-1+this.wave.length)%this.wave.length]
                    value += before[i]
                    value += before[(i+1)%this.wave.length]
                    this.wave[i].set(value/3)
                }
            }

            const noise = html.a`<button title="Noisify the wave">Noise</button>`
            noise.onclick = ()=>{
                for(let i=0; i<this.wave.length; i++){this.wave[i].set(Math.max(-1,Math.min(1, this.wave[i].value+(Math.random()-.5)/2)))}
            }

            const sin = html.a`<button title="Set the wave to a sine wave">Sine</button>`
            sin.onclick = ()=> { for(let i=0; i<this.wave.length; i++) this.wave[i].set(Math.sin(i/this.wave.length*Math.PI*2)) }

            const square = html.a`<button title="Set the wave to a square wave">Square</button>`
            square.onclick = ()=> { for(let i=0; i<this.wave.length; i++) this.wave[i].set(i<this.wave.length/2?1:-1) }

            const sawtooth = html.a`<button title="Set the wave to a sawtooth">Sawtooth</button>`
            sawtooth.onclick = ()=> { for(let i=0; i<this.wave.length; i++) this.wave[i].set(i<this.wave.length/2?i/this.wave.length*2:-2+i/this.wave.length*2) }
            
            const triangle = html.a`<button title="Set the wave to a triangle">Triangle</button>`
            triangle.onclick = ()=> { for(let i=0; i<this.wave.length; i++) this.wave[i].set(i<this.wave.length/2?i/this.wave.length*4-1:3-i/this.wave.length*4) }
    
            content = html`
                ${curve.element}
                <div id="options">
                    ${interpolate.element}
                    <div class=category>${symmetrize} ${smooth} ${noise}</div>
                    <div class=category>${sin} ${square} ${sawtooth} ${triangle}</div>
                </div>
            `
    
            this.#observers.push(()=>curve.dispose(), ()=>interpolate.dispose())
        }
        else if(this.selectedMenu=="attack"){
            const curve = new Curve(
                0,1, 0, false,
                {name:"Attack Duration", unit:"seconds", min:0, max:5, step:0.1, value:gui.attack_duration},
                [],
                this.attack
            )

    
            content = html`
                ${curve.element}
            `
    
            this.#observers.push(()=>curve.dispose())
        }
        else if(this.selectedMenu=="sustain"){
            const curve = new Curve(
                0,1, 0, false,
                {name:"Sustain Duration", unit:"seconds", min:0, max:10, step:0.1, value:gui.sustain_duration},
                [],
                this.sustain
            )

            const loopInput = new BooleanField(this.sustain_loop, "Loop Sustain Curve", "sustain_loop")

            content = html`
                ${curve.element}
                <div id="options">
                    ${loopInput.element}
                </div>
            `
    
            this.#observers.push(()=>curve.dispose(), ()=>loopInput.dispose())
        }
        else if(this.selectedMenu=="release"){
            const curve = new Curve(
                0,1, 0, false,
                {name:"Release Duration", unit:"seconds", min:0, max:5, step:0.1, value:gui.release_duration},
                [],
                this.release
            )

    
            content = html`
                ${curve.element}
            `
    
            this.#observers.push(()=>curve.dispose())
        }
        else if(this.selectedMenu=="preset"){
            const audioNode = this.wam.audioNode
            content = html`
                <div class="button_list">
                ${function*(){
                    for(const [name,state] of Object.entries(PRESETS)){
                        const button = html.a`<button>${name}</button>`
                        button.onclick = ()=>{
                            audioNode.setState(state)
                        }
                        yield button
                    }
                }}
                </div>
            `
        }

        // Create Page
        function onMenuChange(event:Event){
            gui.selectedMenu = (event.target as HTMLElement).id.replace("_menu","")
            gui.connectedCallback()
        }
        this.#root.replaceChildren(html`
            <link rel="stylesheet" crossorigin href="${stylesheet}" />
            <h1>Cardboardizer</h1>
            <ul class="menu">
                <li id=wave_menu @${{click:onMenuChange}}>Wave</li>
                <li id=attack_menu @${{click:onMenuChange}}>Attack</li>
                <li id=sustain_menu @${{click:onMenuChange}}>Sustain</li>
                <li id=release_menu @${{click:onMenuChange}}>Release</li>
                <li id=preset_menu @${{click:onMenuChange}}>Preset</li>
            </ul>
            ${content}
            <div class=crayon></div>
        `)
        this.#root.querySelector(`#${this.selectedMenu}_menu`).classList.add("selected")
    }
    
    disconnectedCallback(){
    
    }

    dispose(){
        this.#paramview.dispose()
        this.#observers.forEach(o=>o())
    }
}


try{
    customElements.define(CardboardGUI.NAME,CardboardGUI)
}catch(e){}


class Curve{
    
    element: HTMLElement

    diposables: (()=>void)[] = []

    static COLORS = ["red","blue","green","yellow","purple","magenta","cyan","orange","pink","brown"]

    constructor(
        min_value: number,
        max_value: number,
        center_value: number,
        doLoop: boolean,

        variable: {
            name: string,
            min: number,
            max: number,
            step: number,
            unit?: string,
            value: MOValue<number>
        }|null,

        separators: {name:string, index:number}[],
        values: Array<MOValue<number>>,
    ){
        const resolution = values.length
        const { diposables } = this
        const span_value = max_value-min_value

        const circles = [] as SVGCircleElement[]
        
        const center_height = Math.round(100-(center_value-min_value)/span_value*100)
        this.element = html.a`
            <div class=curve>
                <svg viewBox="0 0 200 100">
                    <text x=0 y=7 fill=white style="font-size: .5rem">${max_value}</text>
                    <text x=0 y=97 fill=white style="font-size: .5rem">${min_value}</text>
                    <line x1=0 y1=${center_height} x2=200 y2=${center_height} stroke=white stroke-width=1 />
                    ${function*(){
                        let i=0
                        for(const {name,index} of separators){
                            const x = (index)/resolution*200
                            const color = Curve.COLORS[i%Curve.COLORS.length]
                            yield html`<svg><text x=${x+2} y=80 fill=${color} style="font-size: .5rem">${name}</text></svg>`
                            yield html`<svg><line x1=${x} y1=0 x2=${x} y2=100 stroke=${color} stroke-width=1 /></svg>`
                            i++
                        }
                    }}
                    ${function*(){
                        const sep = 200/resolution
                        const start = doLoop?-1:0
                        const end = doLoop?resolution:resolution-1
                        for(let i=start; i<end; i++){
                            const f = (i+resolution)%resolution
                            const t = (f+1)%resolution
                            const from = values[f]
                            const to = values[t]
                            const line = html.a`<svg><line stroke=black stroke-width=1 /></svg>`.children[0] as SVGLineElement
                            line.x1.baseVal.value = (i+0.5)*sep
                            line.x2.baseVal.value = (i+1.5)*sep
                            const update = ()=>{
                                line.y1.baseVal.value = 100-(from.value-min_value)/span_value*100
                                line.y2.baseVal.value = 100-(to.value-min_value)/span_value*100
                            }
                            diposables.push(from.observable.add(update))
                            diposables.push(to.observable.add(update))
                            update()
                            yield line
                        }
                        for(let i=0; i<resolution; i++){
                            const val = values[i]
                            const circle = html.a`<svg><circle r=1.5 stroke=white stroke-width=1 fill=black /></svg>`.children[0] as SVGCircleElement
                            circle.cx.baseVal.value = (i+0.5)*sep
                            diposables.push(val.link(({to})=>{
                                circle.cy.baseVal.value = 100-(val.value-min_value)/span_value*100
                            }))
                            circles.push(circle)
                            yield circle
                        }
                    }}
                </svg>
                ${()=>{
                    if(!variable)return undefined
                    else{
                        const element=html.a`
                            <div>
                                <input type="range" min=${variable.min} max=${variable.max} step=${variable.step} />
                                <label for="curve_length">${variable.name}</label>
                            </div>
                        `
                        const label = element.children[1] as HTMLLabelElement
                        const input = element.children[0] as HTMLInputElement
                        variable.value.link(({to})=>{
                            input.value = to.toString()
                            label.textContent = `${variable.name} (${to}${variable.unit?` ${variable.unit}`:""})`
                        })
                        input.addEventListener("input", ()=>variable.value.set(parseFloat(input.value)))
                        return element
                    }
                }}
                
            </div>
        `

        // Draw curve
        const curve = this.element.children[0]
        const ondraw = (e:MouseEvent)=>{
            const x = Math.round(e.offsetX/curve.clientWidth*resolution)
            const y = Math.max(min_value,Math.min(max_value, (curve.clientHeight-e.offsetY)/curve.clientHeight*span_value+min_value))
            if(x<0||x>=resolution)return
            circles.forEach(it=>it.r.baseVal.value = 1.5)
            circles[x].r.baseVal.value = 3
            const val = values[x]
            if(e.buttons==1) val.set(y)
        }
        curve.addEventListener("mousemove", ondraw)
        curve.addEventListener("mousedown", ondraw)
        curve.addEventListener("mouseleave",()=>{
            circles.forEach(it=>it.r.baseVal.value = 1.5)
        })
    }

    dispose(){
        this.diposables.forEach(d=>d())
    }
}