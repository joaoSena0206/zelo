import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IonList, ModalController } from '@ionic/angular';
import { Geolocation } from '@capacitor/geolocation';
import { first, firstValueFrom } from 'rxjs';
import { BackgroundRunner } from '@capacitor/background-runner';
import { dominio, headerNgrok } from 'src/app/gerais';
import { NavController } from '@ionic/angular';
import { BackgroundGeolocationPlugin } from "@capacitor-community/background-geolocation";
import { registerPlugin } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { DOCUMENT } from '@angular/common';
import {
	ActionPerformed,
	PushNotificationSchema,
	PushNotifications,
	Token,
} from '@capacitor/push-notifications';

@Component({
	selector: 'app-ultimos-pedidos',
	templateUrl: './ultimos-pedidos.page.html',
	styleUrls: ['./ultimos-pedidos.page.scss'],
})
export class UltimosPedidosPage implements OnInit {

	constructor(private http: HttpClient, private navCl: NavController) { }

	ngOnInit() {
		const btn = document.querySelectorAll(".btn_filtro--ativado");
		this.mudarFiltro(btn);
	}

	voltarPag() {
		this.navCl.back();
	}

	trabalhador: any = JSON.parse(localStorage.getItem("trabalhador")!);
	historico: any;
	Nome: any = this.trabalhador.Nome;
	ComentarioAnonimo: any;
	qtEstrelas: any;
	carregar: boolean = false;
	watcherId: any;
	result: any;
	clienteServico: any;
	solicitacaoServico: any;
	enderecoServico: any;
	modal: any;
	listaDataServico: any = [];
	dominio = dominio;

	async carregarHistorico() {
		let trabalhador = JSON.parse(localStorage.getItem("trabalhador")!);
		let link = dominio + `/SolicitacaoServico/CarregarHistoricoTrabalhador?cpf=${trabalhador.Cpf}&tipo=trabalhador`;

		try {

			this.carregar = true;
			let res: any = await firstValueFrom(this.http.get(link, { headers: headerNgrok }));

			this.historico = res;

			console.log(this.historico)
		}
		catch (erro: any) {
			const alert = document.querySelector("ion-alert") as HTMLIonAlertElement;
			alert.message = "Erro ao conectar-se ao servidor";
			alert.present();
		}
		finally {
			this.carregar = false;
		}

		for (let i = 0; i < this.historico.length; i++) {

			const dateString: string = this.historico[i].DtSolicitacaoServico;
			const timestamp: number = Date.parse(dateString);
			const date: Date = new Date(timestamp);

			let dia = date.getDate();
			let mes = date.getMonth() + 1;
			let ano = date.getFullYear();

			let DataFormatada = null;

			if (mes < 10) {
				DataFormatada = dia + "/" + "0" + mes + "/" + ano;
			}
			else {
				DataFormatada = dia + "/" + mes + "/" + ano;
			}

			this.listaDataServico.push(DataFormatada);

			this.historico[i].DtSolicitacaoServico = this.listaDataServico[i];
		}

		for (let i = 0; i < this.historico.length; i++) {
			link = dominio + '/Imgs/Solicitacao/' + this.historico[i].CdSolicitacaoServico + '/1.jpeg';
			let res2: any;
			try {
				res2 = await firstValueFrom(this.http.get(link, { responseType: "blob" }));
			}
			catch
			{
				res2 = null;
			}

			this.historico[i].img = await this.blobParaBase64(res2);
		}
	}

	blobParaBase64(blob: any) {
		if (!blob) {
			return '../../../assets/icon/geral/sem-foto.jpg';
		}

		return new Promise((resolve, _) => {
			const reader = new FileReader();
			reader.onloadend = () => resolve(reader.result);
			reader.readAsDataURL(blob);
		});
	}

	mudarFiltro(btn: any) {
		const btns = document.querySelectorAll(".btn_filtro");

		for (let i = 0; i < btns.length; i++) {
			if (btn !== btns[i]) {
				if (btns[i].classList.contains("btn_filtro--ativado")) {
					btns[i].classList.remove("btn_filtro--ativado");
					btn.classList.add("btn_filtro--ativado");
				}

				if (btn.textContent == "Recentes") {
					this.historico.sort((a: any, b: any) => {
						if (a.DtSolicitacaoServico < b.DtSolicitacaoServico) {
							return -1;
						}
						else if (a.DtSolicitacaoServico > b.DtSolicitacaoServico) {
							return 1;
						}

						return 0;
					});
				}
				else if (btn.textContent == "Antigos") {
					this.historico.sort((a: any, b: any) => {
						if (a.DtSolicitacaoServico > b.DtSolicitacaoServico) {
							return -1;
						}
						else if (a.DtSolicitacaoServico < b.DtSolicitacaoServico) {
							return 1;
						}

						return 0;
					});
				} else {
					this.historico.sort((a: any, b: any) => {
						if (a.Cliente.Avaliacao > b.Cliente.Avaliacao) {
							return -1;
						}
						else if (a.Cliente.Avalaiacao < b.Cliente.Avaliacao) {
							return 1;
						}

						return 0;
					});
				}
			}
		}
	}

	VerPerfil(Cpf: any, Nome: any) {
		let clienteVerPerfil = { Cpf: Cpf, Nome: Nome }
		localStorage.setItem('perfil', JSON.stringify(clienteVerPerfil))
		this.navCl.navigateBack("/trabalhador/perfil-cliente")
	}

	ngAfterViewInit() {
		this.carregarHistorico();
	}

}
